import { prisma } from "../data/prisma.js";


export const getAll = async( req, res) => {

    try {
        const categories = await prisma.category.findMany();
        if (categories.length === 0) return res.json({ message: 'No hay categorias registradas' });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las categorias '});
    }
}