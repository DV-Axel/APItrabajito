import { prisma } from "../prisma.js";
import {guardarTokenRegistro} from "./guardarTokenRegistro.js";

export const reescribirTokenRegistro = async (token,idUsuario,tabla)=> {

    console.log('reenvio de token')

    await prisma[tabla].delete({
        where: { usuarioId: idUsuario }
    })
    return guardarTokenRegistro(token, idUsuario, tabla);
}