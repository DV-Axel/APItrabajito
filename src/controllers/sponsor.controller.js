import { prisma } from "../data/prisma.js";
import {parseIfString} from "../data/helpers.js";
import path from 'path';
import fs from 'fs';

export const createSponsor = async (req, res) => {
    try {
        const {
            businessName, tradeName, cuilId, address, contactName, phone,
            email, alternativeEmail, aditionalInformation, rubros,
            workingDays, workingHours, social
        } = req.body;

        // Parseo de campos JSON
        const rubrosParsed = parseIfString(rubros);
        const workingDaysParsed = parseIfString(workingDays);
        const workingHoursParsed = parseIfString(workingHours);
        const socialParsed = parseIfString(social);

        // Guardar archivos en carpetas específicas
        const logoFile = req.files?.logo?.[0];
        const companyRegFile = req.files?.companyRegistration?.[0];

        let logoPath, companyRegPath;

        // Guardar logo en images/profilePictureSponsor
        if (logoFile) {
            const logoDir = path.join('public', 'images', 'profilePictureSponsor');
            if (!fs.existsSync(logoDir)) fs.mkdirSync(logoDir, { recursive: true });
            logoPath = path.join(logoDir, `${Date.now()}_${logoFile.originalname}`);
            fs.writeFileSync(logoPath, logoFile.buffer);
        }

        // Guardar companyRegistration en files/companyregistration
        if (companyRegFile) {
            const regDir = path.join('public', 'files', 'companyregistration');
            if (!fs.existsSync(regDir)) fs.mkdirSync(regDir, { recursive: true });
            companyRegPath = path.join(regDir, `${Date.now()}_${companyRegFile.originalname}`);
            fs.writeFileSync(companyRegPath, companyRegFile.buffer);
        }

        // Guardar en la base de datos
        const sponsor = await prisma.sponsor.create({
            data: {
                businessName,
                tradeName,
                cuilId: cuilId.toString(),
                address,
                contactName,
                phone: Number(phone),
                email,
                alternativeEmail,
                aditionalInformation,
                logo: logoPath,
                companyRegistration: companyRegPath,
                social: socialParsed,
                workingDays: workingDaysParsed,
                workingHours: workingHoursParsed
            }
        });

        // 2. Insertar en SponsorCategory
        if (Array.isArray(rubrosParsed)) {
            await Promise.all(
                rubrosParsed.map(async (categoryId) => {
                    await prisma.sponsorCategory.create({
                        data: {
                            sponsorId: sponsor.id,
                            categoryId: Number(categoryId)
                        }
                    });
                })
            );
        }

        res.status(201).json({ message: "Sponsor creado correctamente" });
    } catch (error) {
        console.error("Error al crear Sponsor:", error);
        res.status(500).json({ error: "Error al crear Sponsor" });
    }
}