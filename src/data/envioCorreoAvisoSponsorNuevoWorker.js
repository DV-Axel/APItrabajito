import { transporter } from "../utils/mailer.js";
import {getCorreoSponsorAvisoNuevoWorker} from "../utils/emailTemplates.js";

export const envioCorreoAvisoSponsorNuevoWorker = async (emailSponsor, nombreComercialSponsor) => {
    await transporter.sendMail({
        from: "TRABAJITO APP",
        to: emailSponsor,
        subject: "¡Tenes una nueva solicitud de sponsoreo!",
        html: getCorreoSponsorAvisoNuevoWorker(nombreComercialSponsor, emailSponsor)
    })
}