import { verifyToken } from "../helpers/jwt.js";
import {prisma} from "../data/prisma.js";

export const authUser = async (req, res, next) => {
    const token = req.cookies.token_user;

    if (!token) {
        return res.status(401).json({
            message: "No está autenticado.",
        });
    }

    try {
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
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        req.user = usuario;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido",
        });
    }
};