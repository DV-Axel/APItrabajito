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

export function getCorreoDeBienvenidaSponsor(nombre, confirmUrl) {
    const templatePath = path.resolve("templates", "CorreoDeBienvenidaSponsor.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace(/\$\{nombreEmpresa\}/g, nombre);
    html = html.replace(/\$\{confirmUrl\}/g, confirmUrl);
    html = html.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, new Date().getFullYear());
    return html;
}

export function getCorreoResetPasswordSponsor(resetUrl, email) {
    const templatePath = path.resolve("templates", "CorreoResetPasswordSponsor.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace(/\$\{resetUrl\}/g, resetUrl);
    html = html.replace(/\$\{email\}/g, email);

    return html;
}


export function getCorreoRegistroWorker(emailWorker , nombreWorker, apellidoWorker) {
    const templatePath = path.resolve("templates", "CorreoRegistroWorker.html")
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace(/\$\{correoElectronico\}/g, emailWorker);
    html = html.replace(/\$\{nombre\}/g, nombreWorker);
    html = html.replace(/\$\{apellido\}/g, apellidoWorker);

    return html
}

export function getCorreoSponsorAvisoNuevoWorker(nombreComercialSponsor, emailSponsor){
    const templatePath = path.resolve("templates", "CorreoAvisoNuevoWorkerASponsor.html")
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace(/\$\{nombreSponsor\}/g, nombreComercialSponsor);
    html = html.replace(/\$\{correoSponsor\}/g, emailSponsor);
    html = html.replace(/\$\{year\}/g, new Date().getFullYear());

    return html
}
