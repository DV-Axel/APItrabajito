import {prisma} from "../data/prisma.js";
import {parseIfString} from "../data/helpers.js";
import {envioCorreoRegistroWorker} from "../data/envioCorreoRegistroWorker.js";
import {envioCorreoAvisoSponsorNuevoWorker} from "../data/envioCorreoAvisoSponsorNuevoWorker.js"

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