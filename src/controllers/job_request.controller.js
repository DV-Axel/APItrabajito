import { prisma } from "../data/prisma.js";


export const createJobRequest = async (req, res) => {
    try {
        console.log("Petición recibida");
        console.log("Body:", req.body);
        console.log("Files:", req.files); // Muestra los datos en consola

        const parseIfString = ( data ) =>{
            if (typeof data == 'string') return JSON.parse( data );
            return data;
        }

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
            photos = req.files.map(file => ({
                name: file.originalname,
                url: `/images/jobRequests/${file.filename}`,
                note: ''
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
                serviceKey,
                title: parsedForm.titulo,
                urgency: parsedForm.urgencia === "si" || parsedForm.urgencia === true ? true : false,                jobCreationDate: new Date(),
                date: new Date(parsedForm.fecha),
                description: parsedForm.descripcion,
                address: parsedAddress,
                propertyType: propertyType || req.body.tipoPropiedad,
                floor: floor || req.body.piso,
                aparmentNumber: aparmentNumber || req.body.numeroDepto,
                position: parsedPosition,
                extraData,
                photos,
                userId: Number(userId)
            }
        });
        console.log("Guardado en la DB:", jobRequest);
        res.status(200).json(jobRequest);
    } catch (error) {
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
}