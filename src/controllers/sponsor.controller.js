import { prisma } from "../data/prisma.js";
import {parseIfString} from "../data/helpers.js";
import path from 'path';
import fs from 'fs';
import { deleteUploadedFiles } from "../utils/fileUtils.js";
import { supabase } from "../utils/supabaseClient.js";
import { uploadToSupabase } from "../utils/updateToSupabase.js";

export const createSponsor = async (req, res) => {
    
    let logoDestinationPath = null;
    let companyRegDestinationPath = null;

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
        // const logoPath = req.files?.logo?.[0]?.path?.replace(/\\/g, "/");
        // const companyRegPath = req.files?.companyRegistration?.[0]?.path?.replace(/\\/g, "/");
        const logoFile = req.files?.logo?.[0];
        const companyRegFile = req.files?.companyRegistration?.[0];

        let logoUrl = null;
        let companyRegUrl = null;

        if (logoFile) {
            logoDestinationPath = `${cuilId}/logo-${Date.now()}-${logoFile.originalname}`;
            logoUrl = await uploadToSupabase({
                bucket: 'sponsor-logos',
                filePath: logoFile.path,
                destinationPath: logoDestinationPath,
                mimetype: logoFile.mimetype
            });
        }

        if (companyRegFile) {
            companyRegDestinationPath = `${cuilId}/reg-${Date.now()}-${companyRegFile.originalname}`;
            companyRegUrl = await uploadToSupabase({
                bucket: 'sponsor-company-registration',
                filePath: companyRegFile.path,
                destinationPath: companyRegDestinationPath,
                mimetype: companyRegFile.mimetype
            });
        }

        // Validar que el sponsor no esté registrado como usuario
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { email: alternativeEmail }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado como usuario" });
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
        if (Array.isArray(rubrosParsed) && rubrosParsed.length > 0){
            const sponsorCategoriesData = rubrosParsed.map(categoryId => ({
                sponsorId: sponsor.id,
                categoryId: Number(categoryId)
            }));

            await prisma.sponsorCategory.createMany({
                data: sponsorCategoriesData,
                skipDuplicates: true     // Opcional, evita duplicados
            });
        }
       
        res.status(201).json({ message: "Sponsor creado correctamente" });
    } catch (error) {
        // Borrar archivos subidos si hay error
        // if (req.files) {
        //     // Junta todos los archivos en un solo array
        //     const allFIles = Object.values(req.files).flat();
        //     deleteUploadedFiles(allFIles);
        // }

        // Borra archivos subidos a Supabase si la creación falló
        if (logoDestinationPath) {
            await supabase.storage
                .from('sponsor-logos')
                .remove([logoDestinationPath]);
        }
        if (companyRegDestinationPath) {
            await supabase.storage
                .from('sponsor-company-registration')
                .remove([companyRegDestinationPath]);
        }

        console.error("Error al crear Sponsor:", error);
        res.status(500).json({ error: "Error al crear Sponsor" });
    }
}


export const getSponsorFromFormWorker = async (req, res) => {
    try {
        const { cuit, nombre } = req.body;

        let sponsor;
        if (cuit) {
            sponsor = await prisma.sponsor.findFirst({
                where: { cuilId: BigInt(cuit) },
                select: { id: true, tradeName: true, cuilId: true, address: true }

            });

        } else if (nombre) {
            sponsor = await prisma.sponsor.findFirst({
                where: { tradeName: nombre },
                select: { id: true, tradeName: true, cuilId: true, address: true }

            });
        } else {
            return res.status(400).json({ error: "Falta cuit o nombre" });
        }

        if (!sponsor) {
            return res.status(404).json({ error: "Sponsor no encontrado" });
        }

        res.json({
            id: sponsor.id,
            nombre: sponsor.tradeName,
            cuil: sponsor.cuilId.toString(),
            direccion: sponsor.address
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
