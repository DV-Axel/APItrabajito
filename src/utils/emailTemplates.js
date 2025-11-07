import fs from "fs";
import path from "path";

export function getWelcomeEmailHtml(firstName, confirmUrl) {
    const templatePath = path.resolve("templates", "welcomeEmail.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace(/\$\{firstName\}/g, firstName);
    html = html.replace(/\$\{confirmUrl\}/g, confirmUrl);
    html = html.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, new Date().getFullYear());
    return html;
}
