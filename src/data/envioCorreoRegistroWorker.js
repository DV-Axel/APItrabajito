import { transporter } from "../utils/mailer.js";
import {getCorreoRegistroWorker} from "../utils/emailTemplates.js";

export const envioCorreoRegistroWorker = async (correoWorker, nombreWorker, apellidoWorker) => {
    await transporter.sendMail({
        from: "TRABAJITO APP",
        to: correoWorker,
        subject: "Tu solicitud para ser worker ha sido recibida",
        html: getCorreoRegistroWorker(correoWorker, nombreWorker, apellidoWorker)
    });
}