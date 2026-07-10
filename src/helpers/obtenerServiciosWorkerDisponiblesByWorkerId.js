import { prisma } from "../data/prisma.js";

export const obtenerServiciosWorkerDisponiblesByWorkerId = async (workerId) => {
    try {
        const serviciosWorker = await prisma.servicioWorker.findMany({
            select: {
                servicioId: true,
            },
            where: {
                workerId: workerId,
                estaActivo: true,
            },
        });

        return serviciosWorker;

    } catch (error) {
        console.error("obtenerServiciosWorkerDisponiblesByWorkerId error:", error);
        throw error;
    }
};