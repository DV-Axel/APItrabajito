import { prisma } from "../data/prisma.js";


export const createJobRequest = async(req, res) => {
    try {
        const { title, urgency, description, extraData, userId } = req.body;

        const jobRequest = await prisma.jobRequest.create({
            data: {
                title,
                urgency,
                data: new Date(date),
                description,
                extraData,
                userId: Number(userId)
            }
        });
        res.status(201).json(jobRequest);
    } catch (error) {
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