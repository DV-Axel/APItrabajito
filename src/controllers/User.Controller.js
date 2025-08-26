import { prisma } from "../data/prisma.js";


export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        if( users.length === 0 ) return res.json({ message: 'No hay usuarios registrados'});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
}


// Crear un usuario
export const createUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dni,
            email,
            birthDate,
            password,
            phone,
            registrationDate,
            isVerified,
            address
        } = req.body;

        const nuevoUsuario = await prisma.user.create({
            data: {
                firstName,
                lastName,
                dni: Number(dni),
                email,
                birthDate: new Date(birthDate),
                password,
                phone: Number(phone),
                registrationDate: new Date(registrationDate),
                isVerified: Boolean(isVerified),
                address
            }
        });
        res.status(201).json(nuevoUsuario);
    } catch (err) {
        console.error('createUsuario error:', err);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};