import { generateToken } from "../utils/jwt.js";
import { buildConfirUrl } from "../utils/url.js";
import { transporter } from "../utils/mailer.js";
import {getCorreoDeBienvenida} from "../utils/emailTemplates.js";

export const envioCorreoToken = async ({ id, email, nombre }, duracionToken) => {
    const token = generateToken({ userId: id }, duracionToken);
    const confirmUrl = buildConfirUrl(token);

    await transporter.sendMail({
        from: "TRABAJITO APP",
        to: email,
        subject: "Confirma tu correo y accede a todas las soluciones",
        html: getCorreoDeBienvenida(nombre, confirmUrl),
    });

    // ahora devuelvo ambas cosas
    return { token, confirmUrl };
}