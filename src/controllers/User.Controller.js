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











// Crear un usuario
// export const createUser = async (req, res) => {
//     try {
//         const {
//             firstName,
//             lastName,
//             dni,
//             email,
//             birthDate,
//             password,
//             phone,
//             registrationDate,
//             isVerified,
//             address
//         } = req.body;

//         const nuevoUsuario = await prisma.user.create({
//             data: {
//                 firstName,
//                 lastName,
//                 dni: Number(dni),
//                 email,
//                 birthDate: new Date(birthDate),
//                 password,
//                 phone: Number(phone),
//                 registrationDate: new Date(registrationDate),
//                 isVerified: Boolean(isVerified),
//                 address
//             }
//         });
//         res.status(201).json(nuevoUsuario);
//     } catch (err) {
//         console.error('createUsuario error:', err);
//         res.status(500).json({ error: 'Error al crear usuario' });
//     }
// };