import { prisma } from "../prisma.js";
import { guardarTokenRegistroSponsor } from "./guardarTokenRegistroSponsor.js";

export const reescribirTokenRegistroSponsor = async (token, sponsorId) => {

    try {
        await prisma.tokenVerificacionCorreoSponsor.delete({
            where: { sponsorId: sponsorId }
        });
    } catch (error) {
        // Si el error es porque no existe, lo ignoramos
        if (error.code !== 'P2025') {
            throw error; // Otros errores sí los lanzamos
        }
    }
    return guardarTokenRegistroSponsor(token, sponsorId);
};
