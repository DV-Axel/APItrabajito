import { prisma } from "../data/prisma.js";
import { parseIfString } from "../data/helpers.js";
import { uploadToSupabase } from "../utils/updateToSupabase.js";
import { supabase } from "../utils/supabaseClient.js";


export const createWorker = async (req, res) => {

    let destinationPath = null;
    try {
        console.log(req.body);
        console.log(req.file);

        const { subtitle, description, idUser, idSponsor, workLocation, workingDays, workingHours, rubros, sponsor } = req.body;

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

        console.log(idUser);

        if (!idUser) {
        return res.status(400).json({ error: "Falta el idUser" });
        }

        destinationPath = `${idUser}/${req.file.filename}`;
        const imageUrl = await uploadToSupabase({
            bucket:'profile-pictures-worker',
            filePath: req.file.path,
            destinationPath,
            mimetype: req.file.mimetype
        });

        // Cración del Worker
        const worker = await prisma.worker.create({
            data: {
                user: { connect: { id: Number(idUser) } },
                description,
                //profilePicture: photoPath,
                profilePicture: imageUrl,
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
        };
        

        //Creacion del Sponsor-Worker
        if (idSponsor) {
            await prisma.sponsorWorker.create({
                data: {
                    sponsorId: Number(idSponsor), // Conversión a número
                    workerId: worker.id,
                    isActive: true
                }
            });
        };

        res.status(201).send("Worker creado exitosamente");
    } catch (error) {
        console.error(error);

        // Si la foto se subió pero la creación falló, intenta borrarla
        if (destinationPath) {
            await supabase.storage
                .from('profile-pictures-worker')
                .remove([destinationPath]);
        }

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


