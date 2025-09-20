import { prisma } from "../data/prisma.js";


export const getAllCategories = async( req, res) => {

    try {
        const categories = await prisma.category.findMany();
        if (categories.length === 0) return res.json({ message: 'No hay categorias registradas' });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las categorias '});
    }
}


// consultar categoria por id
export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    if ( isNaN(id) ) {
        return res.status(400).json({ error: 'El id debe ser un numero valido' });
    };

    try {
        const category = await prisma.category.findUnique({ where: { id: Number(id) } });
        
        if (!category) {
            return res.status(500).json({ message: 'Error al encontrar la categoria' });
        }
    
        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ message: 'Error al consultar el servidor'})
    }
}



// consultar varias categorias x id
export const getCategoriesByIds = async (req, res) => {
    try {
        // Espera un query param: ?ids=1,2,3
        const idsParam = req.query.ids;
        console.log(idsParam);
        
        if (!idsParam) {
            return res.status(400).json({ error: 'Debes enviar el parametro ids' });
        }

        // Convierte el string "1,2,3" en [1,2,3]
        const ids = idsParam.split(",").map( id => Number(id.trim())).filter( id => !isNaN(id));

        if (ids.length === 0) {
            return res.status(400).json({ error: 'No se enviaron Ids válidos' });
        }

        const categories = await prisma.category.findMany({
            where: { id: { in: ids } }
        });

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las categorías por Ids' });
    }
    
}





// 3. createCategory
// Crear una nueva categoría.
// 4. updateCategory
// Actualizar una categoría existente (por ID).
// 5. deleteCategory
// Eliminar una categoría (por ID).












