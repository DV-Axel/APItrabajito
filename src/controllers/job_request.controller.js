import { prisma } from "../data/prisma.js";
import { parseIfString } from "../data/helpers.js";
import { deleteUploadedFiles } from "../utils/fileUtils.js";


export const createJobRequest = async (req, res) => {
    try {
        console.log("Petición recibida");
        console.log("Body:", req.body);
        console.log("Files:", req.files); // Muestra los datos en consola

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
        
        console.log("Antes de guardar en la DB");
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
        console.log("Guardado en la DB:", jobRequest);
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
            include: { user: true }
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
};




// Obtener jobRequest por filtro de statusId
export const getJobRequestByStatus = async (req, res) => {
    try {
        const { statusId } = req.params;

        if (isNaN(statusId)) {
            return res.status(400).json({ message: "El statusId debe ser un número válido" });
        }

        const jobRequests = await prisma.jobRequest.findMany({
            where: { statusId: Number(statusId) },
            include: { user: true},
            orderBy: { jobCreationDate: 'desc' }
        });

        if (jobRequests.length <= 0) {
            return res.status(404).json({ error: 'No se encontraron servicios con ese estado' })
        }

        res.status(200).json(jobRequests);
    } catch (error) {
        res.status(500).json({ error: 'Error en el Servidor'});
    }
};



// Actualizar el estado del JobRequest
export const updateJobRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusId } = req.body;

        // Validar que el Id sea un número válido
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El id debe ser un número válido' });
        }

        // Validar que el statusId sea un número válido
        if (isNaN(statusId)) {
            return res.status(400).json({ message: 'El rubro debe ser un válido' });
        }

        // Verificar si el JobRequest existe antes de actualizar
        const existingJobRequest = await prisma.jobRequest.findUnique({
            where: { id: Number(id) }
        });
        if (!existingJobRequest) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        // Actualizar el estado
        const jobRequest = await prisma.jobRequest.update({
            where: { id: Number(id) },
            data: { statusId: Number(statusId) },
            include: { user: true }
        });

        res.status(200).json({
            message: 'Estado del servicio actualizado correctamente',
            jobRequest
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del servicio' });
    }
};



// Cancelar jobRequest
export const cancelJobRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const statusId = 4;

        // Validar que el Id sea un número válido
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El id debe ser un número válido' });
        }

        // Verificar si el JobRequest existe antes de actualizar
        const existingJobRequest = await prisma.jobRequest.findUnique({
            where: { id: Number(id) }
        });
        if (!existingJobRequest) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        // Varifica si el servicio está cancelado
        if (existingJobRequest.statusId === 4) {
            return res.status(400).json({ error: 'El servicio ya se encuentra cancelado' });
        }

        const jobRequest = await prisma.jobRequest.update({
            where: { id: Number(id) },
            data: { statusId: Number(statusId) },
            include: { user: true }
        });

        res.status(200).json({
            jobRequest, 
            message: 'Servicio cancelado correctamente'
        });   
    } catch (error) {
        res.status(500).json({ error: 'Error al cancelar el servicio' });
    }
};


//jobRequest por servicio
export const getJobRequestByServiceKey = async (req, res) => {
    try {
        const { serviceKey } = req.params;
        
        const jobRequests = await prisma.jobRequest.findMany({
            where: { serviceKey: Number(serviceKey) },
            include: { user: true },
            orderBy: { jobCreationDate: 'desc' }
        });

        if (jobRequests <= 0) {
             return res.status(404).json({ error: 'No se encontraron servicios para ese rubro' })
        }
        
        res.status(200).json(jobRequests);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los servicios' })
    }
};