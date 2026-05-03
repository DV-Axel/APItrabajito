import {prisma} from "../data/prisma.js";
import bcrypt from "bcryptjs";
import {generateToken, verifyToken} from "../utils/jwt.js";
import {buildConfirUrl} from "../utils/url.js";
import {transporter} from "../utils/mailer.js";
import {getCorreoDeBienvenida} from "../utils/emailTemplates.js";
import {envioCorreoToken} from "../data/envioCorreoToken.js";
import {envioCorreoResetPassword} from "../data/envioCorreoResetPassword.js";
import {OAuth2Client} from "google-auth-library";


export const registrarUsuario = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            numeroDocumento,
            email,
            fechaNacimiento,
            password,
            telefono,
            calle,
            numeroCalle,
            numeroDepartamento,
            codigoPostal,
            tipoDocumento,
            localidad,
            partido,
            provincia
        } = req.body;


        //Etapa de validaciones
        // Validar que el usuario sea mayor de 18 años
        const birth = new Date(fechaNacimiento);
        const today = new Date();
        const age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (age < 18 || (age === 18 && m < 0) || (age === 18 && m === 0 && today.getDate() < birth.getDate())) {
            return res.status(400).json({message: "Debes ser mayor de 18 años para registrarte"});
        }

        // Verificar si el usuario existe
        const existingUser = await prisma.usuario.findUnique({where: {email}});
        if (existingUser) {
            return res.status(400).json({message: "El email ya está registrado"});
        }

        // Validar que el correo no esté registrado como sponsor
        // const existingSponsor = await prisma.sponsor.findUnique({
        //     where: {alternativeEmail: email}
        // });
        //
        // if (existingSponsor) {
        //     return res.status(400).json({message: "El correo ya está registrado como sponsor"});
        // }

        const hashedPassword = await bcrypt.hash(password, 10);

        // default
        let fotoPerfilPath = "/images/profilePicture/avatar.jpeg";
        // si multer subió archivo
        if (req.file) {
            fotoPerfilPath = `/images/profilePicture/${req.file.filename}`;
        }

        const usuarioCreado = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                numeroDocumento,
                email,
                fechaNacimiento: new Date(fechaNacimiento),
                password: hashedPassword,
                telefono: Number(telefono),
                fechaRegistro: new Date(),
                cuentaVerificada: false,
                calle,
                numeroCalle,
                numeroDepartamento,
                codigoPostal,
                tipoDocumento,
                localidad,
                partido,
                provincia,
                fotoPerfilUsuario: fotoPerfilPath,
            },
        });


        //Aqui hago el envio del correo de confirmacion.
        const {token, confirmUrl} = await envioCorreoToken(
            {
                id: usuarioCreado.id,
                email: usuarioCreado.email,
                nombre: usuarioCreado.nombre,
                motivo: "registro"
            },
            "1d"
        );

        console.log("Token generado para confirmación: ", token, confirmUrl);

        return res.status(200).json({
            message: "Usuario creado. Revisa tu correo para confirmar tu cuenta",
            usuarioId: usuarioCreado.id,
        });
    } catch (error) {
        console.error("signup error:", error);
        return res.status(500).json({message: "Error en el registro de usuario", error: error.message});
    }
};


// javascript
export const reenviarConfirmacion = async (req, res) => {
    const {usuarioId} = req.body;

    try {
        if (!usuarioId) {
            return res.status(400).json({message: "usuarioId requerido"});
        }

        // Convertir a número
        const usuarioIdNumber = Number(usuarioId);
        if (Number.isNaN(usuarioIdNumber)) {
            return res.status(400).json({message: "usuarioId debe ser un número"});
        }

        const usuario = await prisma.usuario.findUnique({
            where: {id: usuarioIdNumber},
        });

        if (!usuario) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }

        if (usuario.cuentaVerificada) {
            return res
                .status(400)
                .json({message: "El usuario ya fue confirmado anteriormente"});
        }

        const {token, confirmUrl} = await envioCorreoToken(
            {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                motivo: "reenvio",
            },
            "1d"
        );

        console.log({token, confirmUrl});

        return res.status(200).json({
            message: "Correo reenviado correctamente",
        });
    } catch (error) {
        console.error("reenviarConfirmacion error:", error);
        return res.status(400).json({
            message: "Token inválido o expirado",
            error: error.message,
        });
    }
};


// javascript
export const confirmarCuenta = async (req, res) => {
    const {token} = req.query;
    console.log("confirmar-cuenta query:", req.query);

    if (!token) {
        return res.status(400).json({
            message: "Token no proporcionado",
            code: "TOKEN_NOPROPORCIONADO",
        });
    }

    try {
        const decoded = verifyToken(token);
        const userId = decoded.userId;

        const usuario = await prisma.usuario.findUnique({
            where: {id: userId},
            include: {emailTokens: true},
        });

        if (!usuario) {
            return res
                .status(404)
                .json({message: "Usuario no encontrado", code: "USUARIO_NOENCONTRADO"});
        }

        if (usuario.cuentaVerificada) {
            return res.status(400).json({
                message: "El usuario ya fue confirmado",
                code: "USUARIO_YACONFIRMADO",
            });
        }

        const emailToken = usuario.emailTokens?.[0];
        if (!emailToken) {
            return res.status(400).json({
                message: "No se encontró token de verificación",
                code: "TOKEN_NOENCONTRADO_DB",
            });
        }

        if (emailToken.fechaExpiracion < new Date()) {
            return res.status(400).json({
                message: "El token ha expirado",
                code: "TOKEN_EXPIRADO",
            });
        }

        const actualizarCuentaVerificada = await prisma.usuario.update({
            where: {id: userId},
            data: {cuentaVerificada: true},
        });

        return res.status(200).json({
            message: "Correo confirmado correctamente",
            actualizarCuentaVerificada,
        });
    } catch (error) {
        console.error("confirmarCuenta error:", error);
    }
};


export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({where: {email}});
        if (!usuario) {
            return res.status(400).json({message: "Usuario no encontrado"});
        }

        if (!usuario.cuentaVerificada) {
            return res
                .status(403)
                .json({message: "Debes confirmar tu correo antes de iniciar sesión"});
        }

        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({message: "Correo Electrónico o Password Incorrectos"});
        }

        const token = generateToken({userId: usuario.id}, "2h");

        // Cambiar userId -> usuarioId, que es el campo real en el modelo Worker
        const worker = await prisma.worker.findUnique({
            where: {usuarioId: usuario.id},
        });
        const isWorker = !!worker;

        res.status(200).json({
            message: "Login exitoso",
            token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                fotoPerfilUsuario: usuario.fotoPerfilUsuario,
                isWorker,
            },
        });
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({message: "Error en el login", error: error.message});
    }
};


export const contraseñaOlvidada = async (req, res) => {
    const {email} = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({where: {email}});
        if (!usuario) {
            return res.status(400).json({message: "Usuario no encontrado"});
        }

        await envioCorreoResetPassword(
            {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
            },
            "30m"
        );


        return res.status(200).json({message: "Correo de recuperación enviado"});
    } catch (error) {
        console.error("contraseñaOlvidada error:", error);
        return res.status(500).json({
            message: "Error al solicitar recuperar contraseña",
            error: error.message,
        });
    }
};

export const cambiarContrasenia = async (req, res) => {
    const {token} = req.query;
    const {newPassword, confirmPassword} = req.body;

    try {
        const decoded = verifyToken(token);
        const userId = decoded.userId;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({message: "Las contraseñas no coinciden"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.usuario.update({
            where: {id: userId},
            data: {password: hashedPassword},
        });

        return res.status(200).json({message: "Contraseña restablecida correctamente"});
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expirado",
                code: "TOKEN_EXPIRED",
            });
        }

        return res.status(400).json({
            message: "Token inválido o error al cambiar contraseña",
            code: "TOKEN_INVALID",
            error: error.message,
        });
    }
};

// javascript
export const authGoogle = async (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
        const {credential} = req.body;

        if (!credential) {
            return res.status(400).json({message: "No llegó credential"});
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const {sub, picture, email} = payload;

        // 1\) Busco provider por sub e incluyo usuario
        let authProv = await prisma.authProvider.findFirst({
            where: {providerUserId: sub},
            include: {usuario: true},
        });

        // 2\) Si no lo encuentro o no tiene usuario asociado, busco usuario por email
        if (!authProv || !authProv.usuario) {
            const usuarioRegistro = await prisma.usuario.findUnique({
                where: {email},
            });

            // 2.a) Si NO existe usuario -> devolver 200 con code USUARIO_NOREGISTRADO
            if (!usuarioRegistro) {
                return res.status(200).json({
                    code: "USUARIO_NOREGISTRADO",
                    message: "Usuario no registrado. Debe completar el formulario de registro.",
                    googleData: {
                        sub,
                        email,
                        picture,
                    },
                });
            }

            // 2.b) Si existe usuario -> creo el authProvider asociado y lo incluyo
            authProv = await prisma.authProvider.create({
                data: {
                    provider: "google",
                    providerUserId: sub,
                    avatar: picture,
                    usuarioId: usuarioRegistro.id,
                },
                include: {usuario: true},
            });
        }

        const usuario = authProv.usuario;

        // TODO: VER LO DEL WORKER LO PONGO EN FALSE
        //
        // // 3\) Verifico si es worker
        // const worker = await prisma.worker.findUnique({
        //     where: { usuarioId: usuario.id },
        // });
        // const isWorker = !!worker;

        // 4\) Genero token usando el id del usuario
        const token = generateToken({userId: usuario.id}, "2h");

        return res.status(200).json({
            message: "Login exitoso",
            token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                fotoPerfilUsuario: usuario.fotoPerfilUsuario,
                isWorker: false,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error en auth/google"});
    }
};
