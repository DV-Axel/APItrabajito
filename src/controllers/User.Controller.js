import { prisma } from "../data/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { buildConfirUrl } from "../utils/url.js";
import { transporter } from "../utils/mailer.js";




export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        if( users.length === 0 ) return res.json({ message: 'No hay usuarios registrados'});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
}



export const getUserById = async(req, res) => {

    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ message: "El id debe ser un número válido" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
               
        if (!user) {
            return res.status(500).json({ message:"Error al encontrar el usuario" })
        };

        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ message: "Error al consultar el servidor" })
    }
}



export const setRequestService = async (req, res) => {
    const datos = req.body;

    console.log(datos.serviceKey)

    res.status(200).json({ message: "Datos recibidos", data: req.body });
}



export const deleteUser = async ( req, res ) => {

    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json( { message: "El id debe ser un número válido"} )
    };

    const jobRequest = await prisma.jobRequest.findMany( { where: { userId: Number(id) } } );
    if( jobRequest.length > 0 ) return res.status(400).json( { error: "No puedes eliminar un usuario con servicios pendientes"} )

    try {
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if(!user) return res.status( 404 ).json( { error: "Usuario no encontrado" } );

        const deleted = await prisma.user.delete({
            where: { id: Number(id) }
        });
        res.json(deleted)
    } catch (error) {
        return res.status(400).json( { error: "Eliminación imposible de realizar", data: error.message } );
    }
}



// Actualizar datos basicos (NO SENSIBLES)
export const updateUser = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json( { message: "El id debe ser un número válido"} )
    };

    const { 
        firstName,
        lastName,
        dni,
        idType,
        birthDate,
        phone,
        address,
        number,
        postalCode,
        deparmentNumber
    } = req.body;

    const updateData = {};
    if( firstName !== undefined ) updateData.firstName = firstName;
}













export const updateProfilePicture = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json( { error: 'No se subió ninguna imagen' } );
        }
        const imagePath = `/images/profilePicture/${req.file.filename}`;
        
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { profilePicture: imagePath }
        }); 

        res.json( { sucess: true, imagePath, user });
    } catch (error) {
        res.status(500).json( { error: error.message });
    }
}




