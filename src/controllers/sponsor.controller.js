import { prisma } from "../data/prisma.js";

export const createSponsor = async (req, res) => {
    try {
        console.log("Body:", req.body);
        console.log("Files:", req.files);
        res.status(200).json('Crear Sponsor');
    }catch (error){
        console.error("Error al crear Sponsor:", error);
    }

}