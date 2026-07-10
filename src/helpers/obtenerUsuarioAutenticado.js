import {prisma} from "../data/prisma.js";
import { verifyToken } from "../utils/jwt.js";
export const obtenerUsuarioAutenticado = async (req) => {
    const token = req.cookies.token_user;

    if (!token) {
        throw new Error("No está autenticado.");
    }

    const decoded = verifyToken(token);

    const usuario = await prisma.usuario.findUnique({
        where: {
            id: decoded.userId,
        },
        include: {
            worker: true,
        },
    });

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    return usuario;
};