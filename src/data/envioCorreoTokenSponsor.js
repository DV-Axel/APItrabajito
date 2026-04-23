import {generateToken} from "../utils/jwt.js";
import {buildConfigUrlSponsor} from "../utils/url.js";
import {transporter} from "../utils/mailer.js";
import {getCorreoDeBienvenidaSponsor} from "../utils/emailTemplates.js";
import {guardarTokenRegistroSponsor} from "./funcionesBBDD/guardarTokenRegistroSponsor.js";
import {reescribirTokenRegistroSponsor} from "./funcionesBBDD/reescribirTokenRegistroSponsor.js";
import {prisma} from "./prisma.js";


export const envioCorreoTokenSponsor = async ({id, email, nombre, motivo}, duracionToken) => {
    const token = generateToken({userId: id}, duracionToken);
    const confirmURL = buildConfigUrlSponsor(token)

    if (token) {
        if (motivo === "registro") {
            guardarTokenRegistroSponsor(token, id);
        } else if (motivo === "reenvio") {
            reescribirTokenRegistroSponsor(token, id);
        }
    }

    await transporter.sendMail({
        from: "TRABAJITO APP",
        to: email,
        subject: "Confirma tu correo y comienza a gestionar a tus workers",
        html: getCorreoDeBienvenidaSponsor(nombre, confirmURL),
    });

    return {token, confirmURL};

}