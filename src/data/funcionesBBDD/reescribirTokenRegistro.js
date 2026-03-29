import { prisma } from "../prisma.js";
import {guardarTokenRegistro} from "./guardarTokenRegistro.js";

export const reescribirTokenRegistro = async (token,idUsuario)=> {

    console.log('reenvio de token')

    await prisma.tokenVerificacionCorreo.delete({
        where: { usuarioId: idUsuario }
    })
    return guardarTokenRegistro(token, idUsuario);
}