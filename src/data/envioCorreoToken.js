import { generateToken } from "../utils/jwt.js";
import { buildConfirUrl } from "../utils/url.js";
import { transporter } from "../utils/mailer.js";
import { getWelcomeEmailHtml } from "../utils/emailTemplates.js";

export const envioCorreoToken = async ({ id, email, nombre }, duracionToken) => {
    const token = generateToken({ userId: id }, duracionToken);
    const confirmUrl = buildConfirUrl(token);

    await transporter.sendMail({
        from: "TRABAJITO APP",
        to: email,
        subject: "Confirma tu correo y accede a todas las soluciones",
        html: getWelcomeEmailHtml(nombre, confirmUrl, email),
    });

    // ahora devuelvo ambas cosas
    return { token, confirmUrl };
}