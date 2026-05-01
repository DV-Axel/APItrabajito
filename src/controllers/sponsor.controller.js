import {prisma} from "../data/prisma.js";
import {parseIfString} from "../data/helpers.js";
import {envioCorreoTokenSponsor} from "../data/envioCorreoTokenSponsor.js";
import bcrypt from "bcrypt";
import {verifyToken} from "../utils/jwt.js";
import {envioCorreoResetPasswordSponsor} from "../data/envioCorreoResetPasswordSponsor.js";

export const registrarSponsor = async (req, res) => {
    try {
        const {
            razonSocial,
            nombreComercial,
            tipoDocumento,
            numeroDocumento,
            rubros, // puede venir string JSON o array
            sitioWeb,
            emailEmpresa,
            telefonoEmpresa,
            calleEmpresa,
            numeroCalleEmpresa,
            pisoEmpresa,
            oficinaEmpresa,
            codigoPostalEmpresa,
            localidadEmpresa,
            partidoEmpresa,
            provinciaEmpresa,
            representante, // puede venir string JSON
            password,
        } = req.body;

        // Validaciones mínimas
        if (!emailEmpresa || !password || !razonSocial || !nombreComercial) {
            return res.status(400).json({
                code: "FALTAN_CAMPOS_OBLIGATORIOS",
                message: "Faltan campos obligatorios (emailEmpresa, password, razonSocial, nombreComercial).",
            });
        }

        // Validar campos obligatorios del schema
        if (!sitioWeb || !telefonoEmpresa || !calleEmpresa || !codigoPostalEmpresa || !localidadEmpresa || !partidoEmpresa || !provinciaEmpresa) {
            return res.status(400).json({
                code: "FALTAN_CAMPOS_OBLIGATORIOS",
                message: "Faltan campos obligatorios del domicilio o contacto.",
            });
        }

        // Validar sponsor existente
        const existeSponsor = await prisma.sponsor.findUnique({
            where: {emailEmpresa},
        });

        if (existeSponsor) {
            return res.status(400).json({code: "EMAIL_DUPLICADO", message: "El email ya está registrado"});
        }

        // Hash password
        const passwordHasheada = await bcrypt.hash(password, 10);

        // Foto: default o la subida
        let fotoPerfilPath = "/images/profilePictureSponsor/avatar-default-sponsor.png";
        const logoEmpresaFile = req.files?.logoEmpresa?.[0];
        if (logoEmpresaFile?.filename) {
            fotoPerfilPath = `/images/profilePictureSponsor/${logoEmpresaFile.filename}`;
        }

        // numeroCalleEmpresa: obligatorio y debe ser número
        const numeroCalleParsed = Number(numeroCalleEmpresa);
        if (!numeroCalleEmpresa || Number.isNaN(numeroCalleParsed)) {
            return res.status(400).json({code: "NUMERO_CALLE_INVALIDO", message: "numeroCalleEmpresa inválido"});
        }

        // representante: debe ser JSON válido y objeto
        const representanteParsed = parseIfString(representante);
        if (
            representanteParsed === undefined ||
            representanteParsed === null ||
            typeof representanteParsed !== "object" ||
            Array.isArray(representanteParsed)
        ) {
            return res.status(400).json({
                code: "REPRESENTANTE_INVALIDO",
                message: "representante es requerido y debe ser un JSON válido",
            });
        }

        // rubros: array de IDs de Servicio
        const rubrosParsed = parseIfString(rubros) ?? [];
        const rubrosArray = Array.isArray(rubrosParsed) ? rubrosParsed : [rubrosParsed];
        const servicioIds = rubrosArray
            .map((x) => Number(x))
            .filter((n) => Number.isInteger(n) && n > 0);

        if (servicioIds.length === 0) {
            return res.status(400).json({
                code: "RUBROS_INVALIDOS",
                message: "Debes seleccionar al menos un rubro/servicio",
            });
        }

        const sponsorCreado = await prisma.sponsor.create({
            data: {
                razonSocial,
                nombreComercial,
                tipoDocumento,
                numeroDocumento: String(numeroDocumento),
                sitioWeb,
                emailEmpresa,
                telefonoEmpresa,
                calle: calleEmpresa,
                numeroCalle: numeroCalleParsed,
                piso: pisoEmpresa || null,
                oficina: oficinaEmpresa || null,
                codigoPostal: codigoPostalEmpresa,
                localidad: localidadEmpresa,
                partido: partidoEmpresa,
                provincia: provinciaEmpresa,
                representante: representanteParsed,
                password: passwordHasheada,
                fotoPerfilSponsor: fotoPerfilPath,
            },
        });

// Ahora sí, crea los rubros en transacción (o simplemente con createMany)
        await prisma.sponsorServicio.createMany({
            data: servicioIds.map((servicioId) => ({
                sponsorId: sponsorCreado.id,
                servicioId,
            })),
            skipDuplicates: true,
        });

// Enviar correo de verificación
        const {token, confirmURL} = await envioCorreoTokenSponsor({
            id: sponsorCreado.id,
            email: sponsorCreado.emailEmpresa,
            nombre: sponsorCreado.nombreComercial,
            motivo: "registro"
        }, "1d");

        console.log("Token de verificación enviado al sponsor:", token, confirmURL);

        return res.status(200).json({
            message: "Sponsor registrado correctamente",
            sponsorId: sponsorCreado.id
        });
    } catch (error) {
        console.error("Error al registrar sponsor:", error);
        return res.status(500).json({message: "Error interno al registrar sponsor"});
    }
};

export const reenviarConfirmacion = async (req, res) => {
    try {
        const {sponsorId} = req.body;

        if (!sponsorId) {
            return res.status(400).json({
                message: "Falta el sponsorId en el cuerpo de la solicitud"
            });
        }

        const SponsorIdNumber = Number(sponsorId);
        if (Number.isNaN(SponsorIdNumber) || SponsorIdNumber <= 0) {
            return res.status(400).json({
                message: "El sponsorId debe ser un número entero positivo"
            });
        }

        const sponsor = await prisma.sponsor.findUnique({
            where: {id: SponsorIdNumber},
        });

        if (!sponsor) {
            return res.status(404).json({message: "Sponsor no encontrado"});
        }

        if (sponsor.cuentaVerificada) {
            return res.status(400).json({message: "El sponsor ya ha confirmado su email"});
        }

        const {token, confirmURL} = await envioCorreoTokenSponsor({
            id: sponsor.id,
            email: sponsor.emailEmpresa,
            nombre: sponsor.nombreComercial,
            motivo: "reenvio"
        }, "1d");


        return res.status(200).json({message: "Correo reenviado correctamente"});
    } catch (error) {
        console.error("Error al reenviar confirmación:", error);
        return res.status(500).json({message: "Error interno al reenviar confirmación"});
    }
}

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
        const sponsorId = decoded.sponsorId;

        const sponsor = await prisma.sponsor.findUnique({
            where: {id: sponsorId},
            include: {tokenVerificacionCorreoSponsor: true},
        });

        if (!sponsor) {
            return res
                .status(404)
                .json({message: "Sponsor no encontrado", code: "SPONSOR_NOENCONTRADO"});
        }

        if (sponsor.cuentaVerificada) {
            return res.status(400).json({
                message: "El sponsor ya fue confirmado",
                code: "SPONSOR_YACONFIRMADO",
            });
        }

        const emailToken = sponsor.tokenVerificacionCorreoSponsor;
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

        console.log('pase validaciones')

        const actualizarCuentaVerificada = await prisma.sponsor.update({
            where: {id: sponsorId},
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


export const contraseñaOlvidada = async (req, res) => {
    const {email} = req.body;

    try {
        const sponsor = await prisma.sponsor.findUnique({where: {emailEmpresa: email}});
        if (!sponsor) {
            return res.status(400).json({message: "Sponsor no encontrado"});
        }

        await envioCorreoResetPasswordSponsor(
            {
                id: sponsor.id,
                email: sponsor.emailEmpresa,
                nombre: sponsor.nombre,
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

}

export const cambiarContrasenia = async (req, res) => {
    const {token} = req.query;
    const {newPassword, confirmPassword} = req.body;

    try {
        const decoded = verifyToken(token);
        const sponsorId = decoded.sponsorId;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({message: "Las contraseñas no coinciden"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.sponsor.update({
            where: {id: sponsorId},
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