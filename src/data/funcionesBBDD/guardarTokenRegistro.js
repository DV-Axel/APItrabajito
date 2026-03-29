import { prisma } from "../prisma.js";

export const guardarTokenRegistro = async (token, idUsuario) => {
    return await prisma.tokenVerificacionCorreo.create({
        data: {
            token,
            usuarioId: idUsuario,
            fechaCreacion: new Date(),
            fechaExpiracion: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 día
        }
    });
};
