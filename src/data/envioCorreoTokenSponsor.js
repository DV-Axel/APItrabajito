import { generateToken } from "../utils/jwt.js";
import {buildConfirUrlSposnor} from "../utils/url.js";
import { transporter } from "../utils/mailer.js";
import {getCorreoDeBienvenida, getCorreoDeBienvenidaSponsor} from "../utils/emailTemplates.js";
import {guardarTokenRegistroSponsor} from "./funcionesBBDD/guardarTokenRegistroSponsor.js";
import {prisma} from "./prisma.js";


export const envioCorreoTokenSponsor = async ({id, email, nombre,motivo}, duracionToken) => {
    const token = generateToken({userId: id}, duracionToken);
    const confirmURL = buildConfirUrlSposnor(token)

    if(token){
        if(motivo === "registro"){
            guardarTokenRegistroSponsor(token, id);
        }
    }else if(motivo === "reenvio"){
        reescribirTokenRegistro(token, id, "tokenVerificacionCorreoSponsor");
    }

    await transporter.sendMail({
        from: "TRABAJITO APP",
        to: email,
        subject: "Confirma tu correo y comienza a gestionar a tus workers",
        html: getCorreoDeBienvenidaSponsor(nombre, confirmURL),
    });

    return {token, confirmURL};

}