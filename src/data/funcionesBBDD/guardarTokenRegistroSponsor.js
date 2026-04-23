import { prisma } from "../prisma.js";

export const guardarTokenRegistroSponsor = async (token, idSponsor) => {
    return await prisma.tokenVerificacionCorreoSponsor.create({
        data: {
            token,
            sponsorId: idSponsor,
            fechaCreacion: new Date(),
            fechaExpiracion: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 día
        }
    });
};

