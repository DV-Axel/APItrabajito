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
            address,
            number,
            departmentNumber, 
            postalCode,
            idType,
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
                dni,
                email,
                birthDate: new Date(birthDate),
                password: hashedPassword,
                phone: Number(phone),
                registrationDate: new Date(),
                isVerified: false,
                address,
                number, 
                departmentNumber,
                postalCode,
                idType,
                profilePicture: '/images/avatar.png'
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
        console.log(confirmUrl);
        
        res.status(200).json({ message: "Usuario creado. Revisa tu correo para confirmar tu cuenta" });
                
        } catch (error) {
            console.error("signup error:", error);
            res.status(500).json({ message: "Error en el registro", error: error.message });
    }
}






export const confirmEmail = async(req, res) => {
    const { token } = req.query;
    
    try {
        // Verifica y decodifica el token
        const decoded = verifyToken(token);

        console.log("entre al decode");

        const userId = decoded.userId;
       
        const user = await prisma.user.findUnique({ where: { id: userId }});
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado"});
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




export const login = async(req, res) => {
    const { email, password } = req.body;

    try {

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json( { message: "Usuario no encontrado"} );
        }

        if (!user.isVerified) {
            return res.status(403).json( { message: "Debes confirmar tu correo antes de iniciar sesión" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json( { message: "Datos incorrectos" });
        }

        const token = generateToken({ userId: user.id }, "2h");

        res.status(200).json({
            message: "Login exitoso",
            token,
            user: { id: user.id, email: user.email, nombre: user.firstName, apellido: user.lastName },
        });
        console.log(user);
        
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({ message: "Error en el login", error: error });
    }
}




export const resendConfirmation = async(req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "El usuario ya está confirmado" });
        }

        const token = generateToken({ userId: user.id}, "1h");
        const confirmUrl = buildConfirUrl(token);

        await transporter.sendMail({
            from: "TRABAJITO APP",
            to: email,
            subject: "Reenvío de confirmación tu correo",
            html: `<p>Hola ${ user.firstName }, </p>
                   <p>Por favor confirma tu correo haciendo click en el siguiente enlace:</p>
                   <a href="${confirmUrl}">Confirmar correo</a>`,
        });

        res.status(200).json({ message: "Correo confirmado correctamente" });
        console.log(confirmUrl);
        
    } catch (error) {
        res.status(500).json({
            message: "Error al reenviar confirmación",
            error: error.message
        })
    }
}




export const forgotPassword = async(req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const resetToken = generateToken({ userId: user.id }, "15m");
        const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: "TRABAJITO APP",
            to: email,
            subject: "Recuperación de contraseña",
            html: `<p>Hola ${user.firstName}, </p>}
                   <p>Haz click en el siguiente enlace para reestablecer tu constraseña:</p>
                   <a href="${resetUrl}">Reestablecer contraseña</p>,`
        });
        console.log(resetUrl);
        
        res.status(200).json({ message: "Correo de recuperación enviado" });
    } catch (error) {
        res.status(500).json({
            message: "Error al solicitar recuperar contraseña",
            error: error.message
        })
    }
}



export const resetPassword = async(req, res) => {
    const { token } = req.query;
    const { newPassword} = req.body;

    try {
        const decoded = verifyToken(token);
        const userId = decoded.userId;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: "Contraseña restablecida correctamente"});
    } catch (error) {
        res.status(400).json({ message: "Token inválido o expirado", error: error.message });
    }
}