import fs from "fs";
import path from "path";

//TODO: no se estan mostrando los logos en los emails

export function getCorreoDeBienvenida(nombre, confirmUrl) {
    const templatePath = path.resolve("templates", "CorreoDeBienvenida.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace(/\$\{nombre\}/g, nombre);
    html = html.replace(/\$\{confirmUrl\}/g, confirmUrl);
    html = html.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, new Date().getFullYear());
    return html;
}

export function getCorreoResetPassword(resetUrl, email) {
    const templatePath = path.resolve("templates", "CorreoResetPassword.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace(/\$\{resetUrl\}/g, resetUrl);
    html = html.replace(/\$\{email\}/g, email);

    return html;
}
