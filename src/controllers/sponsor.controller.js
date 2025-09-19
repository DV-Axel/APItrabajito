import { prisma } from "../data/prisma.js";
import {parseIfString} from "../data/helpers.js";
import path from 'path';
import fs from 'fs';
import { deleteUploadedFiles } from "../utils/fileUtils.js";

export const createSponsor = async (req, res) => {
    
    try {
        console.log("Petición recibida");
        console.log("Body:", req.body);
        console.log("Files:", req.files); 

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

        // Rutas de archivos subidos
        const logoPath = req.files?.logo?.[0]?.path?.replace(/\\/g, "/");
        const companyRegPath = req.files?.companyRegistration?.[0]?.path?.replace(/\\/g, "/");

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
        // Borrar archivos subidos si hay error
        if (req.files) {
            // Junta todos los archivos en un solo array
            const allFIles = Object.values(req.files).flat();
            deleteUploadedFiles(allFIles);
        }
        console.error("Error al crear Sponsor:", error);
        res.status(500).json({ error: "Error al crear Sponsor" });
    }
}