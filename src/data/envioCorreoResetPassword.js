import {generateToken} from "../utils/jwt.js";
import {transporter} from "../utils/mailer.js";
import {buildResetPasswordUrl} from "../utils/url.js";
import {getCorreoResetPassword} from "../utils/emailTemplates.js";

export const envioCorreoResetPassword = async ({ id, email, nombre }, duracionToken) => {
    const resetToken = generateToken({ userId: id }, duracionToken);
    const resetUrl = buildResetPasswordUrl(resetToken);

    await transporter.sendMail({
        from: "TRABAJITO APP",
        to: email,
        subject: "Recuperación de contraseña",
        html: getCorreoResetPassword(resetUrl,email)
    });
}