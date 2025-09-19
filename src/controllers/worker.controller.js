import { prisma } from "../data/prisma.js";

export const createWorker = async (req, res) => {
    try{
        console.log(req.body);

        res.status(201).send("Worker creado exitosamente");
    }catch (error){
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }

}