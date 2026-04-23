import { prisma } from "../data/prisma.js";
import { parseIfString } from "../data/helpers.js";
import path from 'path';
import fs from 'fs';

export const registrarWorker = async (req, res) => {
    try{
        console.log(req.body)
        return res.status(500).send({ message: "test" });

    }catch (error){
        console.log(error)
        return res.status(500).send({ message: "Error interno del servidor" });

    }
}































// CONTROLADORES VIEJOS
export const createWorker = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);

        const { subtitle, description, idUser, idSponsor, workLocation, workingDays, workingHours, rubros, sponsor } = req.body;


        // TODO: Revisar que no se guarde primero la foto y despues se rechace
        // Guardar la imagen en disco
        const photoFile = req.files?.photo?.[0];
        let photoPath = null;
        if (photoFile) {
            const uploadDir = path.join(process.cwd(), "public/images/profilePictureWorker");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fileName = Date.now() + "-" + photoFile.originalname;
            const fullPath = path.join(uploadDir, fileName);
            fs.writeFileSync(fullPath, photoFile.buffer);
            // Ruta relativa para guardar en la base de datos
            photoPath = `images/profilePictureWorker/${fileName}`;
        }

        // Parseo si vienen como string (form-data)
        const workLocationParsed = parseIfString(workLocation);
        const workingDaysParsed = parseIfString(workingDays);
        const workingHoursParsed = parseIfString(workingHours);
        const rubrosParsed = parseIfString(rubros);
        const sponsorParsed = parseIfString(sponsor);

        const tipoIdentificacionSponsor = sponsorParsed.tipo;
        const identificadorSponsor = sponsorParsed.cuit || sponsorParsed.nombre;

        const extraData = { ...sponsorParsed };
        delete extraData.tipo;
        delete extraData.cuit;
        delete extraData.nombre;

        console.log(idUser)

        const worker = await prisma.worker.create({
            data: {
                user: { connect: { id: Number(idUser) } },
                description,
                profilePicture: photoPath,
                subtitle,
                extraData,
                workLocation: workLocationParsed,
                workingDays: workingDaysParsed,
                workingHours: workingHoursParsed
            }
        });

        // Guardar rubros en worker_categories
        const rubrosArray = Array.isArray(rubrosParsed)
            ? rubrosParsed.map(Number)
            : [];

        if (rubrosArray.length > 0) {
            await prisma.workerCategory.createMany({
                data: rubrosArray.map(rubroId => ({
                    workerId: worker.id,
                    categoryId: rubroId,
                }))
            });
        }

        

        //Creacion del Worker
        if (idSponsor) {
            await prisma.sponsorWorker.create({
                data: {
                    sponsorId: Number(idSponsor), // Conversión a número
                    workerId: worker.id,
                    isActive: true
                }
            });
        }



        res.status(201).send("Worker creado exitosamente");
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}


export const getWorkerById = async (req, res) => {
    const { id } = req.params;

    try {
        const worker = await prisma.worker.findUnique({
            where: { id: Number(id) }
        });

        if (!worker) {
            return res.status(404).json({ message: "Worker no encontrado" });
        }

        return res.status(200).json(worker);
    } catch (err) {
        return res.status(500).send({ message: "Error interno del servidor" });
    }
}




export const getServicesByCategory = async (req, res) => {
    const {id} = req.params;

    try{
        //Secuencia para traer los servicios del rubro del worker
        // 1. Verificar que el usuario es un worker
        const worker = await prisma.worker.findUnique({
            where: { userId: Number(id) }
        });

        if (!worker) {
            return res.status(404).json({ message: "El usuario no es un worker" });
        }

        // 2. Obtener los rubros (categorías) del worker
        const workerCategories = await prisma.workerCategory.findMany({
            where: { workerId: worker.id },
            select: { categoryId: true }
        });
        const categoryIds = workerCategories.map(wc => wc.categoryId);

        if (categoryIds.length === 0) {
            return res.status(200).json([]); // No tiene rubros asignados
        }


        // 3. Buscar las solicitudes (JobRequest) que coincidan con los rubros
        const jobRequests = await prisma.jobRequest.findMany({
            where: {
                serviceKey: { in: categoryIds }
            }
        });

        console.log(jobRequests);

        res.status(200).json(jobRequests);
    }catch(error){
        res.status(500).send({ message: "Error interno del servidor" });
    }
}

// javascript
export const getJobRequestsAppliedByWorkerId = async (req, res) => {
    const { id } = req.params;
    const workerId = Number(id);
    if (!id || Number.isNaN(workerId)) {
        return res.status(400).json({ message: "ID de worker inválido" });
    }

    try {
        const applications = await prisma.application.findMany({
            where: { workerId },
            include: {
                jobRequest: {
                    select: {
                        id: true,
                        title: true,
                        jobCreationDate: true,
                        date: true,
                        description: true,
                        address: true,
                        finalBudget: true,
                        statusId: true,
                        userId: true,
                        serviceKey: true,
                        photos: true,
                        isVisible: true
                    }
                }
            },
            orderBy: [{ submittedAt: 'desc' }]
        });

        // Mapear a jobRequests, agregando datos de la aplicación y evitando duplicados
        const seen = new Set();
        const jobRequests = [];
        for (const app of applications) {
            const jr = app.jobRequest;
            if (!jr || seen.has(jr.id)) continue;
            seen.add(jr.id);
            jobRequests.push({
                ...jr,
                appliedAt: app.submittedAt,
                applicationId: app.id,
                applicationBudget: app.budget
            });
        }

        return res.status(200).json(jobRequests);
    } catch (error) {
        console.error("Error en getJobRequestsAppliedByWorkerId:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
