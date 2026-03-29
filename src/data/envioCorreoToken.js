import { generateToken } from "../utils/jwt.js";
import { buildConfirUrl } from "../utils/url.js";
import { transporter } from "../utils/mailer.js";
import {getCorreoDeBienvenida} from "../utils/emailTemplates.js";
import {guardarTokenRegistro} from "./funcionesBBDD/guardarTokenRegistro.js";
import {prisma} from "./prisma.js";
import {reescribirTokenRegistro} from "./funcionesBBDD/reescribirTokenRegistro.js";

export const envioCorreoToken = async ({ id, email, nombre, motivo }, duracionToken) => {
    const token = generateToken({ userId: id }, duracionToken);
    const confirmUrl = buildConfirUrl(token);

    if (token) {
        if(motivo === "registro"){
            guardarTokenRegistro(token, id);

        }else if(motivo === "reenvio"){
            reescribirTokenRegistro(token, id)
        }
    }

    await transporter.sendMail({
        from: "TRABAJITO APP",
        to: email,
        subject: "Confirma tu correo y accede a todas las soluciones",
        html: getCorreoDeBienvenida(nombre, confirmUrl),
    });



    // ahora devuelvo ambas cosas
    return { token, confirmUrl };
}