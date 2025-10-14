import { prisma } from "../data/prisma.js";
import { parseIfString } from "../data/helpers.js";
import { deleteUploadedFiles } from "../utils/fileUtils.js";
import { uploadToSupabase } from "../utils/updateToSupabase.js";


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

            photos = await Promise.all(req.files.map(async (file, index) => {
                const imageUrl = await uploadToSupabase({
                    bucket: 'job-requests',
                    filePath: file.path,
                    destinationPath: `${userId}/${Date.now()}-${file.originalname}`,
                    mimetype: file.mimetype
                });
                return {
                    name: file.originalname,
                    url: imageUrl,
                    note: notes[index] || ''
                };
            }));

            // photos = req.files.map( (file, index) => ({
            //     name: file.originalname,
            //     url: `/images/jobRequests/${file.filename}`,
            //     note: notes[index] || ''
            // }));

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


// Obtener un JobRequest por ID
export const getJobRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const jobRequest = await prisma.jobRequest.findUnique({
            where: { id: Number(id) },
            include: { user: true, service: true }
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
        if (jobRequests.length <= 0) {
            return res.status(404).json({ error: 'JobRequests no encontrados para el usuario'})
        }
        res.json(jobRequests);
    } catch (error) {
        res.status(500).json( { error: error.message } );
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
        const { jobRequestId } = req.query;

        if (!jobRequestId) {
            return res.status(400).json({ error: "Falta el parámetro jobRequestId" });
        }

        const applications = await prisma.application.findMany({
            where: { jobRequestId: Number(jobRequestId) },
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
