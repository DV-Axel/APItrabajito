import { prisma } from "../data/prisma.js";
import { parseIfString } from "../data/helpers.js";
import { deleteUploadedFiles } from "../utils/fileUtils.js";


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
            userId
        } = req.body;

    
        // Parsear si vienen como string (form-data)
        const parsedForm = parseIfString(form);
        const parsedAddress = parseIfString(address);
        const parsedPosition = parseIfString(position);

        // Procesar fotos subidas (si llegan como archivos)
        let photos = [];
        if(req.files && req.files.length > 0){
            let notes = req.body.notes || [];
            if(!Array.isArray(notes)) notes = [notes];

            photos = req.files.map( (file, index) => ({
                name: file.originalname,
                url: `/images/jobRequests/${file.filename}`,
                note: notes[index] || ''
            }));

        } else if (req.body.photos){
            // Si el fronten envia un array de fotos como JSON string
            photos = parseIfString(req.body.photos);
        }

        const extraData = { ...parsedForm};
        delete extraData.titulo;
        delete extraData.urgencia;
        delete extraData.fecha;
        delete extraData.descripcion;

        const jobRequest = await prisma.jobRequest.create({
            data: {
                serviceKey: Number(serviceKey),
                title: parsedForm.titulo,
                urgency: parsedForm.urgencia === "si" || parsedForm.urgencia === true ? true : false,                
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
                userId: Number(userId),
                statusId: 1
            }
        });
        res.status(200).json(jobRequest);
    } catch (error) {
        deleteUploadedFiles(req.files);
        console.error("Error al crear JobRequest:", error);
        res.status(500).json({ error: "Imposible crear JobRequest" });
    }
};




// Obtener todos los JobRequests
export const getAllJobRequests = async (req, res) => {
    try {
        const jobRequests = await prisma.jobRequest.findMany({
            include: { user: true }
        });
        res.json(jobRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const setMutualAgreement = async (req, res) => {
    try {
        const { id } = req.params;
        const { entidad } = req.body;

        if (!id || !entidad) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios" });
        }

        let updateData = {};
        if (entidad === "user") {
            updateData.agreementUser = true;
        } else if (entidad === "worker") {
            updateData.agreementWorker = true;
        } else {
            return res.status(400).json({ error: "Entidad inválida" });
        }

        const jobRequest = await prisma.jobRequest.update({
            where: { id: Number(id) },
            data: updateData
        });

        res.status(200).json({ message: 'Acuerdo mutuo registrado correctamente', jobRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const setCancelMutualAgreement = async (req, res) => {
    try {
        const { id } = req.params;
        const { entidad } = req.body;

        if (!id || !entidad) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios" });
        }

        let updateData = {};
        if (entidad === "user") {
            updateData.agreementUser = false;
        } else if (entidad === "worker") {
            updateData.agreementWorker = false;
        } else {
            return res.status(400).json({ error: "Entidad inválida" });
        }

        const jobRequest = await prisma.jobRequest.update({
            where: { id: Number(id) },
            data: updateData
        });

        res.status(200).json({ message: 'Acuerdo mutuo cancelado correctamente', jobRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






// Obtener un JobRequest por ID
export const getJobRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const jobRequest = await prisma.jobRequest.findUnique({
            where: { id: Number(id) },
            include: { user: true, service: true}
        });
        if (!jobRequest) {
            return res.status(404).json({ error: 'JobRequest no encontrado' });
        }
        res.json(jobRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Obtener un JobRequest por el Id del usuario
export const getJobRequestsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({ message: "El id debe ser un número válido" });
        }   

        const jobRequests = await prisma.jobRequest.findMany({
            where: { userId: Number(id) },
            // include: { user: true }
        });
        // if (jobRequests.length <= 0) {
        //     return res.status(404).json({ error: 'JobRequests no encontrados para el usuario'})
        // }
        // res.json(jobRequests);
        return res.status(200).json(jobRequests);
    } catch (error) {
        res.status(500).json( { error: error.message } );
        //console.log(error);
    }
}

export const setPostulation = async (req, res) => {
    const {idJobRequest, presupuesto, presentacion, requiereVisita, idUser} = req.body;

    try {

        if (!idJobRequest || !presupuesto || !presentacion || !idUser) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        // Busca el worker por el idUser
        const worker = await prisma.worker.findUnique({
            where: { userId: Number(idUser) }
        });

        if (!worker) {
            return res.status(404).json({ error: 'No se encontró un trabajador para el usuario indicado' });
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
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
};




export const checkPostulation = async (req, res) => {
    try {
        const { idUser, idJobRequest } = req.query;

        if (!idUser || !idJobRequest) {
            return res.status(400).json({ error: "Faltan parámetros" });
        }

        // Buscar el workerId correspondiente al idUser
        const worker = await prisma.worker.findUnique({
            where: { userId: Number(idUser) }
        });

        if (!worker) {
            return res.status(404).json({ error: "El usuario no es un worker" });
        }

        // Buscar si existe una postulación (Application)
        const postulado = await prisma.application.findFirst({
            where: {
                workerId: worker.id,
                jobRequestId: Number(idJobRequest)
            }
        });

        // Devuelve true si existe, false si no
        res.status(200).json({ yaPostulado: !!postulado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getAplicationsByJobRequestId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Falta el parámetro id" });
        }

        const applications = await prisma.application.findMany({
            where: { jobRequestId: Number(id) },
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
        res.status(500).json({ error: error.message });
    }
};


export const getAplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Falta el parámetro id" });
        }

        const application = await prisma.application.findUnique({
            where: { id: Number(id) },
            include: {
                worker: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!application) {
            return res.status(404).json({ error: "Postulación no encontrada" });
        }

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateApplicationBudget = async (req, res) => {
    try {
        const { id } = req.params; // id de la Application en la URL
        const { budget } = req.body;

        if (!id || budget === undefined) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios (id o budget)" });
        }

        const application = await prisma.application.findUnique({
            where: { id: Number(id) }
        });

        if (!application) {
            return res.status(404).json({ error: "Application no encontrada" });
        }

        const finalBudgetValue = Number(budget);
        if (Number.isNaN(finalBudgetValue)) {
            return res.status(400).json({ error: "Budget inválido" });
        }

        const updatedApplication = await prisma.application.update({
            where: { id: application.id },
            data: {
                budget: finalBudgetValue
            }
        });

        return res.status(200).json({ message: "Budget de la aplicación actualizado", application: updatedApplication });
    } catch (error) {
        console.error("Error en setPresupuestoFinal:", error);
        return res.status(500).json({ error: error.message });
    }
};

// javascript
export const setRateService = async (req, res) => {
    const { id } = req.params;
    let { rating, comment } = req.body;

    try {
        if (!id) return res.status(400).json({ error: "Falta el parámetro id" });

        // Normalizar y validar rating
        rating = Number(rating);
        if (Number.isNaN(rating) || rating < 0 || rating > 5) {
            return res.status(400).json({ error: "Rating inválido (debe ser número entre 0 y 5)" });
        }

        // Obtener applicationSelectedId desde JobRequest
        const jr = await prisma.jobRequest.findUnique({
            where: { id: Number(id) },
            select: { applicationSelectedId: true }
        });
        if (!jr) return res.status(404).json({ error: "JobRequest no encontrado" });
        if (!jr.applicationSelectedId) return res.status(400).json({ error: "JobRequest no tiene una aplicación seleccionada" });

        // Obtener workerId desde Application
        const application = await prisma.application.findUnique({
            where: { id: jr.applicationSelectedId },
            select: { workerId: true }
        });
        if (!application) return res.status(404).json({ error: "Application seleccionada no encontrada" });

        const workerId = application.workerId;

        // Obtener datos actuales del worker
        const worker = await prisma.worker.findUnique({
            where: { id: workerId },
            select: { rating: true, jobsCompleted: true }
        });
        if (!worker) return res.status(404).json({ error: "Worker no encontrado" });

        // Extraer valor numérico seguro del rating (Prisma Decimal)
        const currentRating = worker.rating != null
            ? (typeof worker.rating === 'object' && typeof worker.rating.toNumber === 'function'
                ? worker.rating.toNumber()
                : Number(worker.rating))
            : 0;
        const currentJobs = Number(worker.jobsCompleted || 0);
        const newJobs = currentJobs + 1;
        const newRating = ((currentRating * currentJobs) + rating) / newJobs;

        // Ejecutar actualizaciones en transacción
        const [updatedJobRequest, updatedWorker] = await prisma.$transaction([
            prisma.jobRequest.update({
                where: { id: Number(id) },
                data: {
                    userRatingForWorker: rating,
                    userCommentForWorker: comment ?? null
                }
            }),
            prisma.worker.update({
                where: { id: workerId },
                data: {
                    jobsCompleted: { increment: 1 },
                    rating: newRating
                }
            })
        ]);

        return res.status(200).json({ message: "Calificación registrada", jobRequest: updatedJobRequest, worker: updatedWorker });
    } catch (error) {
        console.error("Error en setRateService:", error);
        return res.status(500).json({ error: error.message });
    }
};




export const updateDateJobRequest = async (req, res) => {
    try {
        const { id } = req.params;
        let { date } = req.body;

        if (!id || date === undefined) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios (id o date)" });
        }

        // Si el body trae la fecha como stringified JSON, parsearla
        date = parseIfString(date);

        const newDate = new Date(date);
        if (Number.isNaN(newDate.getTime())) {
            return res.status(400).json({ error: "Fecha inválida" });
        }

        const jobRequest = await prisma.jobRequest.findUnique({
            where: { id: Number(id) }
        });

        if (!jobRequest) {
            return res.status(404).json({ error: "JobRequest no encontrado" });
        }

        const updatedJobRequest = await prisma.jobRequest.update({
            where: { id: jobRequest.id },
            data: { date: newDate }
        });

        return res.status(200).json({ message: "Fecha actualizada correctamente", jobRequest: updatedJobRequest });
    } catch (error) {
        console.error("Error en updateDateJobRequest:", error);
        return res.status(500).json({ error: error.message });
    }
};

// javascript
export const setFinalBudget = async (req, res) => {
    try {
        const { id } = req.params;
        let { finalBudget } = req.body;

        if (!id || finalBudget === undefined) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios (id o finalBudget)" });
        }

        // Manejar casos donde venga como stringified JSON u otros formatos
        finalBudget = parseIfString(finalBudget);

        const finalBudgetValue = Number(finalBudget);
        if (Number.isNaN(finalBudgetValue)) {
            return res.status(400).json({ error: "finalBudget inválido" });
        }

        const jobRequest = await prisma.jobRequest.findUnique({
            where: { id: Number(id) }
        });

        if (!jobRequest) {
            return res.status(404).json({ error: "JobRequest no encontrado" });
        }

        const updatedJobRequest = await prisma.jobRequest.update({
            where: { id: jobRequest.id },
            data: {
                finalBudget: finalBudgetValue
            }
        });

        return res.status(200).json({ message: "FinalBudget actualizado", jobRequest: updatedJobRequest });
    } catch (error) {
        console.error("Error en setFinalBudget:", error);
        return res.status(500).json({ error: error.message });
    }
};


// javascript
export const setConfirmJobRequestFinalized = async (req, res) => {
    try {
        const { id } = req.params;
        const { entidad } = req.body;

        if (!id || !entidad) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios" });
        }

        let updateData = {};
        if (entidad === "user") {
            updateData.workFinishedUser = true;
        } else if (entidad === "worker") {
            updateData.workFinishedWorker = true;
        } else {
            return res.status(400).json({ error: "Entidad inválida" });
        }

        const jobRequest = await prisma.jobRequest.update({
            where: { id: Number(id) },
            data: updateData
        });

        res.status(200).json({ message: 'Confirmación de finalización registrada correctamente', jobRequest });
    } catch (error) {
        console.error("Error en setConfirmJobRequestFinalized:", error);
        res.status(500).json({ error: error.message });
    }
};

