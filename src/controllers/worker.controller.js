import {prisma} from "../data/prisma.js";
import {parseIfString} from "../data/helpers.js";
import {envioCorreoRegistroWorker} from "../data/envioCorreoRegistroWorker.js";
import {envioCorreoAvisoSponsorNuevoWorker} from "../data/envioCorreoAvisoSponsorNuevoWorker.js"
import { obtenerUsuarioAutenticado } from "../helpers/obtenerUsuarioAutenticado.js";
import {obtenerServiciosWorkerDisponiblesByWorkerId} from "../helpers/obtenerServiciosWorkerDisponiblesByWorkerId.js";

export const registrarWorker = async (req, res) => {
    try {
        const {
            idUser,
            idSponsor,
            subtitulo,
            descripcion,
            provincias,
            diasTrabajo,
            turnos,
            categorias,
            tipoIdentificacion,
            cuitEmpresa,
            nombreEmpresa,
            nombreContacto,
            motivoUnirse,
        } = req.body;

        // Validación si ya existe como worker
        const existeWorker =
            await prisma.worker.findUnique({
                where: {
                    usuarioId: Number(idUser)
                }
            });

        if (existeWorker) {
            return res.status(400).send({
                message: "El usuario ya es un worker"
            });
        }

        // Validación campos obligatorios
        if (
            !idUser ||
            !subtitulo ||
            !descripcion ||
            !provincias ||
            !diasTrabajo ||
            !turnos ||
            !categorias ||
            !tipoIdentificacion ||
            (tipoIdentificacion === "cuit" && !cuitEmpresa) ||
            (tipoIdentificacion === "nombre" && !nombreEmpresa) ||
            !nombreContacto ||
            !motivoUnirse
        ) {
            return res.status(400).send({
                message: "Faltan datos obligatorios"
            });
        }

        // Validación foto
        if (
            !req.files ||
            !req.files.fotoPerfilWorker ||
            req.files.fotoPerfilWorker.length === 0
        ) {
            return res.status(400).send({
                message: "Debe cargar una foto"
            });
        }

        const fotoPerfilPath =
            `/images/profilePictureWorker/${req.files.fotoPerfilWorker[0].filename}`;

        // Buscar sponsor
        const sponsor =
            await prisma.sponsor.findUnique({
                where: {
                    id: Number(idSponsor)
                },
                include: {
                    sponsorServicios: true
                }
            });

        if (!sponsor) {
            return res.status(404).send({
                message: "Sponsor no encontrado"
            });
        }

        // Validar categorías permitidas
        const serviciosSponsor =
            sponsor.sponsorServicios.map(
                ss => ss.servicioId
            );

        const categoriasArray =
            parseIfString(categorias);

        const categoriasIds =
            categoriasArray.map(Number);

        const categoriasValidas =
            categoriasIds.every(catId =>
                serviciosSponsor.includes(catId)
            );

        if (!categoriasValidas) {
            return res.status(400).send({
                message:
                    "El sponsor no ofrece todos los servicios requeridos por el worker"
            });
        }


        //El insert como transaccion da la posibilidad de hacer rollback si algo falla en el proceso, evitando datos inconsistentes
        const workerRegistrado =
            await prisma.$transaction(
                async (tx) => {

                    // Crear worker
                    const worker =
                        await tx.worker.create({
                            data: {
                                usuario: {
                                    connect: {
                                        id: Number(idUser)
                                    }
                                },

                                tituloProfesional:
                                subtitulo,

                                descripcionProfesional:
                                descripcion,

                                estado: {
                                    connect: {
                                        id: 7
                                    }
                                },

                                fotoPerfilWorker:
                                fotoPerfilPath,

                                zonasTrabajo:
                                    parseIfString(
                                        provincias
                                    ),

                                diasTrabajo:
                                    parseIfString(
                                        diasTrabajo
                                    ),

                                turnosTrabajo:
                                    parseIfString(
                                        turnos
                                    ),

                                datosExtraWorker: {
                                    tipoIdentificacion,
                                    cuitEmpresa,
                                    nombreEmpresa,
                                    nombreContacto,
                                    motivoUnirse
                                }
                            },

                            include: {
                                usuario: true
                            }
                        });

                    // Asociar sponsor-worker
                    await tx.sponsor_worker.create({
                        data: {
                            workerId: worker.id,
                            sponsorId:
                                Number(idSponsor),
                            estadoId: 7
                        }
                    });

                    // Asignar categorías
                    const servicios =
                        await tx.ServicioWorker.createMany({
                            data: categoriasIds.map(
                                catId => ({
                                    workerId:
                                    worker.id,
                                    servicioId:
                                    catId
                                })
                            )
                        });

                    // Si no insertó nada -> rollback
                    if (servicios.count === 0) {
                        throw new Error(
                            "Error al asignar servicios"
                        );
                    }

                    // Esto retorna la transacción
                    return worker;
                }
            );


        //Dejo los emails afuera por que no dependen de la base de datos.
        try {
            await envioCorreoRegistroWorker(
                workerRegistrado.usuario.email,
                workerRegistrado.usuario.nombre,
                workerRegistrado.usuario.apellido
            );

            await envioCorreoAvisoSponsorNuevoWorker(
                sponsor.emailEmpresa,
                sponsor.nombreComercial,
            )
        } catch (emailError) {
            console.error(
                "Error enviando email:",
                emailError
            );
        }

        return res.status(200).send({
            message:
                "¡Solicitud enviada con exito!"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).send({
            message:
                "Error interno del servidor"
        });
    }
};



export const traerPerfilWorker = async (req, res) => {
    try {
        const {id} = req.params;

        const worker = await prisma.worker.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                usuario: true,
                estado: true,
                serviciosWorker: {
                    include: {
                        servicio: true,
                    },
                },
                sponsorWorkers: true,
            },
        });

        if (!worker) {
            return res.status(404).send({
                message:
                    "Worker no encontrado"
            });
        }

        return res.status(200).send(worker);

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message:
                "Error interno del servidor"
        });
    }
};

export const actualizarPerfilWorker = async (req, res) => {
    try {
        const {
            workerId,
            tituloProfesional,
            descripcionProfesional,
            zonasTrabajo,
            diasTrabajo,
            turnosTrabajo,
        } = req.body;

        if (
            !workerId ||
            !tituloProfesional ||
            !descripcionProfesional ||
            !zonasTrabajo ||
            !diasTrabajo ||
            !turnosTrabajo
        ) {
            return res.status(400).send({
                message: "Datos obligatorios faltantes",
            });
        }

        const workerActualizado = await prisma.worker.update({
            where: {
                id: Number(workerId),
            },
            data: {
                tituloProfesional,
                descripcionProfesional,
                zonasTrabajo,
                diasTrabajo,
                turnosTrabajo,
            },
        });

        return res.status(200).send({
            message: "Perfil actualizado con éxito",
            worker: workerActualizado,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).send({
            message: "Ocurrió un error al actualizar el perfil.",
        });
    }
};

export const traerTrabajosDisponibles = async (req, res) => {
    try {
        const usuario = await obtenerUsuarioAutenticado(req);
        const workerId = usuario.worker.id;
        const serviciosWorkerDisponibles = await obtenerServiciosWorkerDisponiblesByWorkerId(workerId);


        const serviciosIds = serviciosWorkerDisponibles.map(
            servicio => servicio.servicioId
        );

        if (serviciosIds.length === 0) {
            return [];
        }



        // usar workerId para consultar
        const trabajosDisponibles = await prisma.SolicitudServicio.findMany({
            where: {
                estadoId: 1,
                servicioId: {
                    in: serviciosIds
                }
            },
            select: {
                id: true,
                titulo: true,
                descripcion: true,
                servicioId: true,
                esUrgente: true,
                fechaCreacion: true,
                desgloseDireccion: true,
                fotos: true,
                preguntasEspeccificas: true,
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                    }
                }
            }
        });

        return res.status(200).send(trabajosDisponibles);


    } catch (error) {
        return res.status(401).json({
            message: error.message,
        });
    }
};


export const aplicarSolicitud = async (req, res) => {
    try {
        const usuario = await obtenerUsuarioAutenticado(req);
        const workerId = usuario.worker.id;
        const {
            solicitudServicioId,
            presupuesto,
            tiempoEstimado,
            fechaPropuesta,
            fechaAlternativa,
            incluyeMateriales,
            garantia,
            mensaje,
        } = req.body;

        console.log("usuario", usuario)
        console.log("workerId", workerId)


        if (!solicitudServicioId) {
            return res.status(400).send({
                message: "Solicitud ID es obligatorio",
            });
        }

        // Verificar si el worker ya aplicó a esta solicitud
        const aplicacionExistente = await prisma.postulacion.findFirst({
            where: {
                workerId: workerId,
                solicitudServicioId: solicitudServicioId,
            },
        });

        if (aplicacionExistente) {
            return res.status(400).send({
                message: "Ya aplicaste a esta solicitud",
            });
        }

        // Crear la aplicación
        await prisma.postulacion.create({
            data: {
                workerId,
                solicitudServicioId,

                presupuesto: Number(presupuesto),
                tiempoEstimado,
                fechaPropuesta: new Date(fechaPropuesta),
                fechaAlternativa: fechaAlternativa
                    ? new Date(fechaAlternativa)
                    : null,

                incluyeMateriales,
                garantia: garantia || null,
                mensaje,

                fechaPostulacion: new Date(),
            },
        });

        return res.status(200).send({
            message: "Aplicación enviada con éxito",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Error interno del servidor",
        });
    }
};