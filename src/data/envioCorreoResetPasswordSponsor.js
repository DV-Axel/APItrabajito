import {generateToken} from "../utils/jwt.js";
import {transporter} from "../utils/mailer.js";
import {buildResetPasswordUrlSponsor} from "../utils/url.js";
import {getCorreoResetPasswordSponsor} from "../utils/emailTemplates.js";

export const envioCorreoResetPasswordSponsor = async ({ id, email, nombre }, duracionToken) => {
    const resetToken = generateToken({ sponsorId: id }, duracionToken);
    const resetUrl = buildResetPasswordUrlSponsor(resetToken);

    console.log(resetUrl)

    await transporter.sendMail({
        from: "TRABAJITO APP",
        to: email,
        subject: "Recuperación de contraseña SPONSOR",
        html: getCorreoResetPasswordSponsor(resetUrl,email)
    });
}