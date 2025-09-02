import { prisma } from "../data/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { buildConfirUrl } from "../utils/url.js";
import { transporter } from "../utils/mailer.js";



export const signup = async(req, res) => {
    try {
        const {
            firstName,
            lastName,
            dni,
            email,
            birthDate,
            password,
            phone,
            isVerified,
            address,
            number,
            departmentNumber, 
            postalCode
            } = req.body;
            
        // Verificar si el usuario existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if ( existingUser ) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        // Hashea la constraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario con isVerified: false
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                dni: Number(dni),
                email,
                birthDate: new Date(birthDate),
                password: hashedPassword,
                phone: Number(phone),
                registrationDate: new Date(),
                isVerified: false,
                address,
                number, 
                departmentNumber,
                postalCode
            }
        });

        const token = generateToken({ userId: newUser.id });
        const confirmUrl = buildConfirUrl( token );

        await transporter.sendMail({
            from: "TRABAJITO APP",
            to: email,
            subject: "Confirma tu correo",
            html: `<p>Hola ${ firstName }, </p>
                   <p>Por favor confirma tu correo haciendo click en el siguiente enlace:</p>
                   <a href="${confirmUrl}">Confirmar correo</a>`,
        });

        res.status(200).json({ message: "Usuario creado. Revisa tu correo para confirmar tu cuenta" });
                
        } catch (error) {
            console.error("signup error:", error);
            res.status(500).json({ error: "Error en el registro", detail: error.message });
    }
}



export const confirmEmail = async(req, res) => {
    const { token } = req.query;
    
    try {
        // Verifica y decodifica el token
        const decoded = verifyToken(token);
        const userId = decoded.userId;
       
        const user = await prisma.user.findUnique({ where: { id: userId }});
        
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado"});
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "El usuario ya fue confirmado"});
        }

        // Busca y actualiza el usuario
        const updateUser = await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true},
        });

        res.status(200).json({ message: "Correo confirmado correctamente", updateUser });
    } catch (error) {
        res.status(400).json({ message: "Token inválido o expirado", error: error.message });
    }
}




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