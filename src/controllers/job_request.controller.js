import {prisma} from "../data/prisma.js";
import {parseIfString} from "../data/helpers.js";
import {deleteUploadedFiles} from "../utils/fileUtils.js";

//CONTROLADORES NUEVOS
export const getServicios = async (req, res) => {
    try {
        const servicios = await prisma.servicio.findMany({})
        res.status(200).json(servicios);
    } catch (error) {
        console.error("Error al obtener servicios:", error);
        res.status(500).json({error: "Imposible obtener servicios"});
    }
}

export const getPreguntasSerivicio = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({error: "Falta el parámetro id"});
        }

        const preguntas = await prisma.preguntaServicio.findMany({
            where: {servicioId: Number(id)},
            include: {opciones: true},
            orderBy: {id: "asc"},
        });

        const resultado = preguntas.map((p) => {
            const options = p.opciones?.map((o) => o.valor) ?? [];

            return {
                id: p.id,
                name: p.id,
                label: p.pregunta,
                type: p.tipoInput,
                placeholder: p.ayuda ?? null,
                required: p.esObligatoria, // <- aquí lo exponés al front
                options: options.length > 0 ? options : null,
            };
        });

        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al obtener preguntas del servicio:", error);
        return res.status(500).json({error: "Imposible obtener preguntas del servicio"});
    }
};


// javascript
export const setPublicarServicio = async (req, res) => {
    try {
        console.log("body:", req.body);
        console.log("files:", req.files);

        let {
            servicio,
            titulo,
            descripcion,
            esUrgente,
            preguntasEspecificas,
            desgloseDireccion,
            usuarioId
        } = req.body;

        // Validaciones básicas
        if (!servicio || !titulo || !descripcion || !desgloseDireccion || !usuarioId) {
            return res.status(400).json({
                error: "Faltan campos obligatorios (servicio, titulo, descripcion, desgloseDireccion, usuarioId)"
            });
        }

        // Parseos varios
        const servicioId = Number(servicio);
        const usuarioIdNum = Number(usuarioId);
        const esUrgenteBool = esUrgente === "true" || esUrgente === true;

        try {
            preguntasEspecificas = preguntasEspecificas
                ? JSON.parse(preguntasEspecificas)
                : null;
        } catch {
            return res.status(400).json({error: "preguntasEspecificas no es un JSON válido"});
        }

        try {
            desgloseDireccion = JSON.parse(desgloseDireccion);
        } catch {
            return res.status(400).json({error: "desgloseDireccion no es un JSON válido"});
        }

        // Armar array de fotos desde multer
        const fotos = (req.files || []).map((file) => {
            // ruta relativa que después podés servir estáticamente
            return `/uploads/servicios/${file.filename}`;
        });

        // Crear la solicitud en la tabla `SolicitudServicio`
        const solicitud = await prisma.solicitudServicio.create({
            data: {
                titulo,
                descripcion,
                esUrgente: esUrgenteBool,
                preguntasEspeccificas: preguntasEspecificas,
                fotos,
                desgloseDireccion,
                usuario: {connect: {id: usuarioIdNum}},
                servicio: {connect: {id: servicioId}},
                // estadoId usa el default (1) según el schema
            }
        });

        return res.status(201).json(solicitud);
    } catch (error) {
        console.error("Error al publicar servicio:", error);
        return res.status(500).json({error: "Imposible publicar servicio"});
    }
};

export const getSolcitudesByUsuarioId = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: "Falta el parámetro id"});
        }

        const solicitudes = await prisma.solicitudServicio.findMany({
            where: {usuarioId: Number(id)},
            include: {
                servicio: true,
                estado: true
            },
            orderBy: {fechaCreacion: "desc"}
        });

        return res.status(200).json(solicitudes);
    } catch (error) {
        console.error("Error al obtener solicitudes por usuarioId:", error);
        return res.status(500).json({error: "Imposible obtener solicitudes por usuarioId"});
    }
}

export const getSolicitudBySolcitudId = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: "Falta el parámetro id"});
        }

        const solicitud = await prisma.solicitudServicio.findUnique({
            where: {id: Number(id)},
            include: {
                servicio: true,
                estado: true,
                usuario:true,

            }
        });

        if (!solicitud) {
            return res.status(404).json({error: "Solicitud no encontrada"});
        }

        return res.status(200).json(solicitud);
    } catch (error) {
        console.error("Error al obtener solicitud por id:", error);
    }
}

export const setCancelarSolicitud = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: "Falta el parámetro id"});
        }

        const solicitud = await prisma.solicitudServicio.findUnique({
            where: {id: Number(id)}
        });

        if (!solicitud) {
            return res.status(404).json({error: "Solicitud no encontrada"});
        }

        const updatedSolicitud = await prisma.solicitudServicio.update({
            where: {id: Number(id)},
            data: {
                estadoId: 6 // id del estado "cancelada"
            }
        });

        return res.status(200).json({
            message: "Solicitud cancelada correctamente",
            solicitud: updatedSolicitud
        });
    } catch (error) {
        console.error("Error al cancelar solicitud:", error);
        return res.status(500).json({error: "Imposible cancelar solicitud"});
    }
}

export const setActualizarSolicitud = async (req, res) => {
    try {
        console.log("BODY ACTUALIZAR:", req.body)
        console.log("FILES ACTUALIZAR:", req.files)

        const {id} = req.params

        let {
            servicio,
            titulo,
            descripcion,
            esUrgente,
            preguntasEspeccificas,
            desgloseDireccion,
            usuarioId,
            servicioId,
            fotosExistentes, // <- viene del front como string JSON
        } = req.body

        if (!id) {
            return res
                .status(400)
                .json({error: "Falta el parámetro id en la URL"})
        }

        const solicitud = await prisma.solicitudServicio.findUnique({
            where: {id: Number(id)},
        })

        if (!solicitud) {
            return res.status(404).json({error: "Solicitud no encontrada"})
        }

        // Normalizar tipos
        if (typeof esUrgente === "string") {
            esUrgente = esUrgente === "true"
        }

        // Parsear JSON de preguntas
        try {
            if (typeof preguntasEspeccificas === "string") {
                preguntasEspeccificas = JSON.parse(preguntasEspeccificas)
            }
        } catch (e) {
            console.error("Error parseando preguntasEspeccificas:", e)
            return res
                .status(400)
                .json({error: "preguntasEspeccificas no es un JSON válido"})
        }

        // Parsear JSON de desgloseDireccion
        try {
            if (desgloseDireccion && typeof desgloseDireccion === "string") {
                desgloseDireccion = JSON.parse(desgloseDireccion)
            }
        } catch (e) {
            console.error("Error parseando desgloseDireccion:", e)
            return res
                .status(400)
                .json({error: "desgloseDireccion no es un JSON válido"})
        }

        // Parsear fotosExistentes (paths que se conservan)
        let fotosExistentesArray = []
        try {
            if (typeof fotosExistentes === "string") {
                fotosExistentesArray = JSON.parse(fotosExistentes)
            } else if (Array.isArray(fotosExistentes)) {
                fotosExistentesArray = fotosExistentes
            }
        } catch (e) {
            console.error("Error parseando fotosExistentes:", e)
            return res
                .status(400)
                .json({error: "fotosExistentes no es un JSON válido"})
        }

        // Asegurar que sea array de strings
        if (!Array.isArray(fotosExistentesArray)) {
            fotosExistentesArray = []
        }

        const nuevasFotos = (req.files || []).map(
            (file) => `/uploads/servicios/${file.filename}`
        )

// Armar data base (sin fotos todavía)
        const data = {
            titulo,
            descripcion,
            esUrgente,
            preguntasEspeccificas,
            desgloseDireccion,
        }

        // \- Interpretar fotosExistentesArray correctamente:
//   * `null` / `undefined` \=\> front no tocó nada de fotos \-\> mantener las viejas
//   * `[]` (array vacío) \=\> front quiere dejar 0 fotos
//   * `[...paths]` \=\> mantener solo esas y sumar nuevas
        let todasLasFotos

        if (fotosExistentes !== undefined) {
            // el front SI mandó fotosExistentes (aunque sea "[]")
            const fotosExistentesArrayRaw = (() => {
                if (typeof fotosExistentes === "string") {
                    try {
                        const parsed = JSON.parse(fotosExistentes)
                        return Array.isArray(parsed) ? parsed : []
                    } catch {
                        return []
                    }
                }
                if (Array.isArray(fotosExistentes)) return fotosExistentes
                return []
            })()

            todasLasFotos = [...fotosExistentesArrayRaw, ...nuevasFotos]
        } else {
            // el front NO mandó fotosExistentes \=\> no tocó nada de fotos
            // mantenemos las que ya tenía la solicitud
            todasLasFotos = [...(solicitud.fotos || []), ...nuevasFotos]
        }

// ahora SÍ, si el front mandó [] y no subió nuevas,
// todasLasFotos será [] y se guardan 0 fotos
        data.fotos = todasLasFotos

// resto de la lógica de usuario / servicio...
        if (usuarioId) {
            data.usuario = {connect: {id: Number(usuarioId)}}
        }

        const servicioIdFinal = servicioId || servicio
        if (servicioIdFinal) {
            data.servicio = {connect: {id: Number(servicioIdFinal)}}
        }

        const updatedSolicitud = await prisma.solicitudServicio.update({
            where: {id: Number(id)},
            data,
        })

        return res.status(200).json({
            message: "Solicitud actualizada correctamente",
            solicitud: updatedSolicitud,
        })
    } catch (error) {
        console.error("Error al actualizar solicitud:", error)
        return res
            .status(500)
            .json({error: "Imposible actualizar solicitud"})
    }
}


// CONTROLADORES VIEJOS
// javascript
export const createJobRequest = async (req, res) => {

    try {
        const {
            serviceKey,
            form,
            address,
            propertyType,
            floor,
            aparmentNumber,
            position,
            userId,
            paymentMethodId
        } = req.body;

        if (!serviceKey || !userId || !paymentMethodId) {
            return res.status(400).json({error: 'Faltan serviceKey, userId o paymentMethodId'});
        }

        // Parsear si vienen como string (form-data)
        const parsedForm = parseIfString(form);
        const parsedAddress = parseIfString(address);
        const parsedPosition = parseIfString(position);

        // Procesar fotos subidas (si llegan como archivos)
        let photos = [];
        if (req.files && req.files.length > 0) {
            let notes = req.body.notes || [];
            if (!Array.isArray(notes)) notes = [notes];

            photos = req.files.map((file, index) => ({
                name: file.originalname,
                url: `/images/jobRequests/${file.filename}`,
                note: notes[index] || ''
            }));
        } else if (req.body.photos) {
            photos = parseIfString(req.body.photos);
        }

        const extraData = {...parsedForm};
        delete extraData.titulo;
        delete extraData.urgencia;
        delete extraData.fecha;
        delete extraData.descripcion;

        const jobRequest = await prisma.jobRequest.create({
            data: {
                // Campos escalares
                title: parsedForm.titulo,
                urgency: parsedForm.urgencia === "si" || parsedForm.urgencia === true,
                jobCreationDate: new Date(),
                date: new Date(parsedForm.fecha),
                description: parsedForm.descripcion,
                address: parsedAddress,
                propertyType: propertyType || req.body.tipoPropiedad,
                floor: floor || req.body.piso,
                aparmentNumber: aparmentNumber || req.body.numeroDepto,
                position: parsedPosition,
                extraData,
                photos,
                // Relaciones requeridas: usar connect
                user: {connect: {id: Number(userId)}},
                status: {connect: {id: 1}}, // si siempre es 1 al crear
                service: {connect: {id: Number(serviceKey)}},
                paymentMethod: {connect: {id: Number(paymentMethodId)}}
            }
        });

        res.status(200).json(jobRequest);
    } catch (error) {
        deleteUploadedFiles(req.files);
        console.error("Error al crear JobRequest:", error);
        res.status(500).json({error: "Imposible crear JobRequest"});
    }
};


// Obtener todos los JobRequests
export const getAllJobRequests = async (req, res) => {
    try {
        const jobRequests = await prisma.jobRequest.findMany({
            include: {user: true}
        });
        res.json(jobRequests);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


// javascript
export const setMutualAgreement = async (req, res) => {
    try {
        const {id} = req.params;
        const {entidad} = req.body;

        if (!id || !entidad) {
            return res.status(400).json({error: "Faltan parámetros obligatorios"});
        }

        if (entidad !== "user" && entidad !== "worker") {
            return res.status(400).json({error: "Entidad inválida"});
        }

        const jobRequest = await prisma.jobRequest.findUnique({
            where: {id: Number(id)},
            select: {agreementUser: true, agreementWorker: true}
        });

        if (!jobRequest) {
            return res.status(404).json({error: "JobRequest no encontrado"});
        }

        // Calcular nuevos valores según la entidad
        const newAgreementUser = entidad === "user" ? true : jobRequest.agreementUser;
        const newAgreementWorker = entidad === "worker" ? true : jobRequest.agreementWorker;

        const updateData = {
            agreementUser: newAgreementUser,
            agreementWorker: newAgreementWorker
        };

        // Si ambos acuerdos son true, poner statusId a 3 (en progreso)
        if (newAgreementUser && newAgreementWorker) {
            updateData.statusId = 3;
        }

        const updatedJobRequest = await prisma.jobRequest.update({
            where: {id: Number(id)},
            data: updateData
        });

        return res.status(200).json({
            message: 'Acuerdo mutuo registrado correctamente',
            jobRequest: updatedJobRequest
        });
    } catch (error) {
        console.error("Error en setMutualAgreement:", error);
        return res.status(500).json({error: error.message});
    }
};

export const setCancelMutualAgreement = async (req, res) => {
    try {
        const {id} = req.params;
        const {entidad} = req.body;

        if (!id || !entidad) {
            return res.status(400).json({error: "Faltan parámetros obligatorios"});
        }

        let updateData = {};
        if (entidad === "user") {
            updateData.agreementUser = false;
        } else if (entidad === "worker") {
            updateData.agreementWorker = false;
        } else {
            return res.status(400).json({error: "Entidad inválida"});
        }

        const jobRequest = await prisma.jobRequest.update({
            where: {id: Number(id)},
            data: updateData
        });

        res.status(200).json({message: 'Acuerdo mutuo cancelado correctamente', jobRequest});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// javascript
export const setChangeMethodPayment = async (req, res) => {
    try {
        const {id} = req.params;
        const {paymentMethodId} = req.body;

        if (!id || !paymentMethodId) {
            return res.status(400).json({error: "Faltan parámetros obligatorios (id o paymentMethodId)"});
        }

        const jobRequest = await prisma.jobRequest.findUnique({
            where: {id: Number(id)}
        });
        if (!jobRequest) {
            return res.status(404).json({error: "JobRequest no encontrado"});
        }

        const paymentMethod = await prisma.paymentMethod.findUnique({
            where: {id: Number(paymentMethodId)}
        });
        if (!paymentMethod) {
            return res.status(404).json({error: "PaymentMethod no encontrado"});
        }

        const updatedJobRequest = await prisma.jobRequest.update({
            where: {id: Number(id)},
            data: {
                paymentMethod: {connect: {id: Number(paymentMethodId)}}
            },
            include: {paymentMethod: true}
        });

        return res.status(200).json({message: "Método de pago actualizado", jobRequest: updatedJobRequest});
    } catch (error) {
        console.error("Error en setChangeMethodPayment:", error);
        return res.status(500).json({error: error.message});
    }
};


// Obtener un JobRequest por ID
export const getJobRequestById = async (req, res) => {
    try {
        const {id} = req.params;
        const jobRequest = await prisma.jobRequest.findUnique({
            where: {id: Number(id)},
            include: {user: true, service: true, paymentMethod: true}
        });
        if (!jobRequest) {
            return res.status(404).json({error: 'JobRequest no encontrado'});
        }
        res.json(jobRequest);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


// Obtener un JobRequest por el Id del usuario
export const getJobRequestsByUserId = async (req, res) => {
    try {
        const {id} = req.params;

        if (isNaN(id)) {
            return res.status(400).json({message: "El id debe ser un número válido"});
        }

        const jobRequests = await prisma.jobRequest.findMany({
            where: {userId: Number(id)},
            // include: { user: true }
        });
        // if (jobRequests.length <= 0) {
        //     return res.status(404).json({ error: 'JobRequests no encontrados para el usuario'})
        // }
        // res.json(jobRequests);
        return res.status(200).json(jobRequests);
    } catch (error) {
        res.status(500).json({error: error.message});
        //console.log(error);
    }
}

export const setPostulation = async (req, res) => {
    const {idJobRequest, presupuesto, presentacion, requiereVisita, idUser} = req.body;

    try {

        if (!idJobRequest || !presupuesto || !presentacion || !idUser) {
            return res.status(400).json({error: 'Faltan datos obligatorios'});
        }

        // Busca el worker por el idUser
        const worker = await prisma.worker.findUnique({
            where: {userId: Number(idUser)}
        });

        if (!worker) {
            return res.status(404).json({error: 'No se encontró un trabajador para el usuario indicado'});
        }

        // Crea la postulación
        const application = await prisma.application.create({
            data: {
                jobRequestId: Number(idJobRequest),
                workerId: worker.id,
                budget: Number(presupuesto),
                description: presentacion,
                requireVisit: Boolean(requiereVisita)
            }
        });


        res.status(200).json('Postulación recibida');
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


export const checkPostulation = async (req, res) => {
    try {
        const {idUser, idJobRequest} = req.query;

        if (!idUser || !idJobRequest) {
            return res.status(400).json({error: "Faltan parámetros"});
        }

        // Buscar el workerId correspondiente al idUser
        const worker = await prisma.worker.findUnique({
            where: {userId: Number(idUser)}
        });

        if (!worker) {
            return res.status(404).json({error: "El usuario no es un worker"});
        }

        // Buscar si existe una postulación (Application)
        const postulado = await prisma.application.findFirst({
            where: {
                workerId: worker.id,
                jobRequestId: Number(idJobRequest)
            }
        });

        // Devuelve true si existe, false si no
        res.status(200).json({yaPostulado: !!postulado});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


export const getAplicationsByJobRequestId = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: "Falta el parámetro id"});
        }

        const applications = await prisma.application.findMany({
            where: {jobRequestId: Number(id)},
            include: {
                worker: {
                    include: {
                        user: true
                    }
                }
            }
        });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


export const getAplicationById = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: "Falta el parámetro id"});
        }

        const application = await prisma.application.findUnique({
            where: {id: Number(id)},
            include: {
                worker: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!application) {
            return res.status(404).json({error: "Postulación no encontrada"});
        }

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


export const updateApplicationBudget = async (req, res) => {
    try {
        const {id} = req.params; // id de la Application en la URL
        const {budget} = req.body;

        if (!id || budget === undefined) {
            return res.status(400).json({error: "Faltan parámetros obligatorios (id o budget)"});
        }

        const application = await prisma.application.findUnique({
            where: {id: Number(id)}
        });

        if (!application) {
            return res.status(404).json({error: "Application no encontrada"});
        }

        const finalBudgetValue = Number(budget);
        if (Number.isNaN(finalBudgetValue)) {
            return res.status(400).json({error: "Budget inválido"});
        }

        const updatedApplication = await prisma.application.update({
            where: {id: application.id},
            data: {
                budget: finalBudgetValue
            }
        });

        return res.status(200).json({
            message: "Budget de la aplicación actualizado",
            application: updatedApplication
        });
    } catch (error) {
        console.error("Error en setPresupuestoFinal:", error);
        return res.status(500).json({error: error.message});
    }
};


export const setRateService = async (req, res) => {
    const {id} = req.params;
    let {rating, comment} = req.body;

    try {
        if (!id) return res.status(400).json({error: "Falta el parámetro id"});

        // Normalizar y validar rating
        rating = Number(rating);
        if (Number.isNaN(rating) || rating < 0 || rating > 5) {
            return res.status(400).json({error: "Rating inválido (debe ser número entre 0 y 5)"});
        }

        // Obtener applicationSelectedId desde JobRequest
        const jr = await prisma.jobRequest.findUnique({
            where: {id: Number(id)},
            select: {applicationSelectedId: true}
        });
        if (!jr) return res.status(404).json({error: "JobRequest no encontrado"});
        if (!jr.applicationSelectedId) return res.status(400).json({error: "JobRequest no tiene una aplicación seleccionada"});

        // Obtener workerId desde Application
        const application = await prisma.application.findUnique({
            where: {id: jr.applicationSelectedId},
            select: {workerId: true}
        });
        if (!application) return res.status(404).json({error: "Application seleccionada no encontrada"});

        const workerId = application.workerId;

        // Obtener datos actuales del worker
        const worker = await prisma.worker.findUnique({
            where: {id: workerId},
            select: {rating: true, jobsCompleted: true}
        });
        if (!worker) return res.status(404).json({error: "Worker no encontrado"});

        // Extraer valor numérico seguro del rating (Prisma Decimal)
        const currentRating = worker.rating != null
            ? (typeof worker.rating === 'object' && typeof worker.rating.toNumber === 'function'
                ? worker.rating.toNumber()
                : Number(worker.rating))
            : 0;
        const currentJobs = Number(worker.jobsCompleted || 0);
        const newJobs = currentJobs + 1;
        const newRating = ((currentRating * currentJobs) + rating) / newJobs;

        // Ejecutar actualizaciones en transacción (incluye statusId = 5)
        const [updatedJobRequest, updatedWorker] = await prisma.$transaction([
            prisma.jobRequest.update({
                where: {id: Number(id)},
                data: {
                    userRatingForWorker: rating,
                    userCommentForWorker: comment ?? null,
                    statusId: 5
                }
            }),
            prisma.worker.update({
                where: {id: workerId},
                data: {
                    jobsCompleted: {increment: 1},
                    rating: newRating
                }
            })
        ]);

        return res.status(200).json({
            message: "Calificación registrada",
            jobRequest: updatedJobRequest,
            worker: updatedWorker
        });
    } catch (error) {
        console.error("Error en setRateService:", error);
        return res.status(500).json({error: error.message});
    }
};


export const updateDateJobRequest = async (req, res) => {
    try {
        const {id} = req.params;
        let {date} = req.body;

        if (!id || date === undefined) {
            return res.status(400).json({error: "Faltan parámetros obligatorios (id o date)"});
        }

        // Si el body trae la fecha como stringified JSON, parsearla
        date = parseIfString(date);

        const newDate = new Date(date);
        if (Number.isNaN(newDate.getTime())) {
            return res.status(400).json({error: "Fecha inválida"});
        }

        const jobRequest = await prisma.jobRequest.findUnique({
            where: {id: Number(id)}
        });

        if (!jobRequest) {
            return res.status(404).json({error: "JobRequest no encontrado"});
        }

        const updatedJobRequest = await prisma.jobRequest.update({
            where: {id: jobRequest.id},
            data: {date: newDate}
        });

        return res.status(200).json({message: "Fecha actualizada correctamente", jobRequest: updatedJobRequest});
    } catch (error) {
        console.error("Error en updateDateJobRequest:", error);
        return res.status(500).json({error: error.message});
    }
};

// javascript
export const setFinalBudget = async (req, res) => {
    try {
        const {id} = req.params;
        let {finalBudget} = req.body;

        if (!id || finalBudget === undefined) {
            return res.status(400).json({error: "Faltan parámetros obligatorios (id o finalBudget)"});
        }

        // Manejar casos donde venga como stringified JSON u otros formatos
        finalBudget = parseIfString(finalBudget);

        const finalBudgetValue = Number(finalBudget);
        if (Number.isNaN(finalBudgetValue)) {
            return res.status(400).json({error: "finalBudget inválido"});
        }

        const jobRequest = await prisma.jobRequest.findUnique({
            where: {id: Number(id)}
        });

        if (!jobRequest) {
            return res.status(404).json({error: "JobRequest no encontrado"});
        }

        const updatedJobRequest = await prisma.jobRequest.update({
            where: {id: jobRequest.id},
            data: {
                finalBudget: finalBudgetValue
            }
        });

        return res.status(200).json({message: "FinalBudget actualizado", jobRequest: updatedJobRequest});
    } catch (error) {
        console.error("Error en setFinalBudget:", error);
        return res.status(500).json({error: error.message});
    }
};


// javascript
export const setConfirmJobRequestFinalized = async (req, res) => {
    try {
        const {id} = req.params;
        const {entidad} = req.body;

        if (!id || !entidad) {
            return res.status(400).json({error: "Faltan parámetros obligatorios"});
        }

        if (entidad !== "user" && entidad !== "worker") {
            return res.status(400).json({error: "Entidad inválida"});
        }

        const jobRequest = await prisma.jobRequest.findUnique({
            where: {id: Number(id)},
            select: {workFinishedUser: true, workFinishedWorker: true}
        });

        if (!jobRequest) {
            return res.status(404).json({error: "JobRequest no encontrado"});
        }

        const newWorkFinishedUser = entidad === "user" ? true : jobRequest.workFinishedUser;
        const newWorkFinishedWorker = entidad === "worker" ? true : jobRequest.workFinishedWorker;

        const updateData = {
            workFinishedUser: newWorkFinishedUser,
            workFinishedWorker: newWorkFinishedWorker
        };

        if (newWorkFinishedUser && newWorkFinishedWorker) {
            updateData.statusId = 4;
        }

        const updatedJobRequest = await prisma.jobRequest.update({
            where: {id: Number(id)},
            data: updateData
        });

        return res.status(200).json({
            message: "Confirmación registrada correctamente",
            jobRequest: updatedJobRequest
        });
    } catch (error) {
        console.error("Error en setConfirmJobRequestFinalized:", error);
        return res.status(500).json({error: error.message});
    }
}
