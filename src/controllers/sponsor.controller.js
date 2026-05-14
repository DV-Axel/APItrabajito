import {prisma} from "../data/prisma.js";
import {parseIfString} from "../data/helpers.js";
import {envioCorreoTokenSponsor} from "../data/envioCorreoTokenSponsor.js";
import bcrypt from "bcrypt";
import {verifyToken, generateToken} from "../utils/jwt.js";
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

export const loginSponsor = async (req, res) => {
    const {email, password} = req.body;

    try {
        const sponsor = await prisma.sponsor.findUnique({where: {emailEmpresa: email}});

        if (!sponsor) {
            return res.status(400).json({message: "Sponsor no encontrado"});
        }

        if (!sponsor.cuentaVerificada) {
            return res.status(400).json({message: "El email del sponsor no ha sido verificado"});
        }

        const isMatch = await bcrypt.compare(password, sponsor.password);
        if (!isMatch) {
            return res.status(400).json({message: "Contraseña incorrecta"});
        }

        const token = generateToken({sponsorId: sponsor.id}, "2h");

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, //TODO: Pasar esto a true en producción con HTTPS
            sameSite: "Lax",
            maxAge: 1000 * 60 * 60 * 24
        })


        return res.status(200).json({message: "Login exitoso",});
    } catch (error) {
        console.error("loginSponsor error:", error);
        return res.status(500).json({message: "Error interno al iniciar sesión"});
    }
}

export const extraerDatosSponsor = async (req, res) => {
    const token = req.cookies.token;


    if (!token) return res.status(401).json({message: "No esta autenticado."})

    try {
        const decoded = verifyToken(token);

        const sponsor = await prisma.sponsor.findUnique({
            where: {id: decoded.sponsorId}, // <-- usa sponsorId
            select: {
                id: true,
                emailEmpresa: true,
                nombreComercial: true,
                fotoPerfilSponsor: true
            }
        })

        if (!sponsor) {
            return res.status(404).json({message: "Sponsor no encontrado"});
        }

        res.json({user: sponsor});
    } catch (error) {
        console.error("extraerDatosSponsor error:", error);
        return res.status(401).json({message: "Token inválido o error al extraer datos"});
    }
}

export const perfilSponsor = async (req, res) => {
    try {
        const sponsorId = Number(req.params.id); // <-- aquí obtienes el id

        if (isNaN(sponsorId)) {
            return res.status(400).json({message: "ID inválido"});
        }

        const sponsor = await prisma.sponsor.findUnique({
            where: {id: sponsorId},
            include: {
                sponsorServicios: {
                    include: {servicio: true}
                }
            }
        });

        if (!sponsor) {
            return res.status(404).json({message: "Sponsor no encontrado"});
        }

        return res.status(200).json(sponsor);
    } catch (error) {
        console.error("perfilSponsor error:", error);
        return res.status(500).json({message: "Error interno"});
    }
};


export const actualizarPerfilSponsor = async (req, res) => {
    try {
        const {id} = req.params;

        const {
            nombreComercial,
            provincia,
            partido,
            numeroCalle,
            sitioWeb,
            emailEmpresa,
            telefonoEmpresa,
            calle,
            piso,
            oficina,
            localidad,
            codigoPostal,
            representante
        } = req.body;

        console.log(req.body)

        if (!nombreComercial || !provincia || !partido || !numeroCalle || !emailEmpresa || !telefonoEmpresa || !calle || !codigoPostal || !representante) {
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }

        // Validar que el sponsor exista
        const sponsor = await prisma.sponsor.findUnique({where: {id: Number(id)}});
        if (!sponsor) {
            return res.status(404).json({message: "Sponsor no encontrado"});
        }

        // Actualizar datos
        const sponsorActualizado = await prisma.sponsor.update({
            where: {id: Number(id)},
            data: {
                nombreComercial,
                numeroCalle: Number(numeroCalle),
                sitioWeb,
                partido,
                emailEmpresa,
                telefonoEmpresa,
                calle,
                piso: piso || null,
                provincia,
                oficina: oficina || null,
                localidad,
                codigoPostal,
                representante // se guarda como JSON
            }
        });

        return res.status(200).json({
            message: "Perfil actualizado correctamente",
            sponsor: sponsorActualizado
        });
    } catch (error) {
        console.error("actualizarPerfilSponsor error:", error);
        return res.status(500).json({message: "Error interno"});
    }
};


export const busquedaSponsorPorIdentificacion = async (req, res) => {
    try {
        const {
            tipoIdentificacion,
            cuitEmpresa,
            nombreEmpresa
        } = req.query

        let sponsor = null

        if (tipoIdentificacion === "cuit") {
            sponsor = await prisma.sponsor.findFirst({
                where: {
                    numeroDocumento: cuitEmpresa
                }
            })
        }

        if (tipoIdentificacion === "nombre") {
            sponsor = await prisma.sponsor.findFirst({
                where: {
                    nombreComercial: {
                        contains: nombreEmpresa,
                        mode: "insensitive"
                    }
                }
            })
        }

        if (!sponsor) {
            return res.status(404).send({
                message: "No se encontró un sponsor con esos datos"
            })
        }

        return res.status(200).send(sponsor)

    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error interno del servidor"
        })
    }
}


export const pendientesSponsoreo = async (req, res) => {
    try {
        const {id} = req.params

        // Validaciones
        if (!id) {
            return res.status(400).send({
                message:
                    "No se esta enviando id del sponsor"
            })
        }

        const solicitudesSponsoreo =
            await prisma.sponsor_worker.findMany({
                where: {
                    sponsorId: Number(id),
                },

                include: {
                    worker: {
                        select: {
                            id: true,
                            tituloProfesional: true,
                            descripcionProfesional: true,
                            fotoPerfilWorker: true,
                            rating: true,
                            trabajosCompletados: true,
                            fechaRegistroWorker: true,

                            usuario: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    apellido: true,
                                    email: true,
                                    telefono: true,
                                    fotoPerfilUsuario: true,
                                    partido: true,
                                    provincia: true
                                }
                            },

                            // Servicios del worker
                            serviciosWorker: {
                                select: {
                                    id: true,
                                    tieneCertificacion: true,
                                    estaActivo: true,
                                    fechaRegistro: true,

                                    servicio: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                            icono: true,
                                            color: true
                                        }
                                    }
                                }
                            }
                        }
                    },

                    estado: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    }
                }
            })

        return res
            .status(200)
            .send(solicitudesSponsoreo || [])

    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message:
                "Error interno del servidor"
        })
    }
}


export const datosHeaderSponsor = async (req, res) => {
    try {
        const sponsorId = Number(req.params.id);

        if (!sponsorId || Number.isNaN(sponsorId)) {
            return res.status(400).send({
                error: "ID de sponsor inválido",
            });
        }

        const [sponsor, workersActivos, pendientesSponsoreo] =
            await Promise.all([
                prisma.sponsor.findUnique({
                    where: {
                        id: sponsorId,
                    },

                    select: {
                        id: true,
                        fotoPerfilSponsor:true,
                        razonSocial: true,
                        nombreComercial: true,
                    },
                }),

                prisma.sponsor_worker.count({
                    where: {
                        sponsorId,
                        estadoId: 8,
                    },
                }),

                prisma.sponsor_worker.count({
                    where: {
                        sponsorId,
                        estadoId: 7,
                    },
                }),
            ]);

        if (!sponsor) {
            return res.status(404).send({
                error: "Sponsor no encontrado",
            });
        }

        return res.status(200).send({
            ...sponsor,
            workersActivos,
            pendientesSponsoreo,
        });
    } catch (error) {
        console.error("datosHeaderSponsor error:", error);

        return res.status(500).send({
            error: "Error interno del servidor",
        });
    }
};

export const decisionSponsoreo = async (req, res) => {
    const { id } = req.params;
    const { accion } = req.body;

    console.log(req.body);
    console.log(req.params);

    try {
        if (!accion) {
            return res.status(400).send({
                message: "No seleccionó una acción",
            });
        }

        let nuevoEstado;

        if (accion === "accept") {
            nuevoEstado = 8;
        } else if (accion === "reject") {
            nuevoEstado = 9;
        } else {
            return res.status(400).send({
                message: "Acción inválida",
            });
        }

        await prisma.sponsor_worker.update({
            where: {
                id: parseInt(id),
            },
            data: {
                estadoId: nuevoEstado,
            },
        });

        return res.status(200).send({
            message:
                accion === "accept"
                    ? "Sponsoreo aceptado"
                    : "Sponsoreo rechazado",
        });
    } catch (error) {
        console.error("decisionSponsoreo error:", error);

        return res.status(500).send({
            error: "Error interno del servidor",
        });
    }
};

export const perfilWorker = async (req, res) => {
    try {
        const workerId = Number(req.params.id);

        console.log('workerId', workerId)

        if (!workerId || Number.isNaN(workerId)) {
            return res.status(400).send({
                error: "ID de worker inválido",
            });
        }

        const worker = await prisma.worker.findUnique({
            where: {
                id: workerId,
            },

            select: {
                id: true,
                tituloProfesional: true,
                descripcionProfesional: true,
                fotoPerfilWorker: true,
                rating: true,
                trabajosCompletados: true,
                fechaRegistroWorker: true,

                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        email: true,
                        telefono: true,
                        fotoPerfilUsuario: true,
                        partido: true,
                        provincia: true,
                        localidad: true
                    }
                },

                // Servicios del worker
                serviciosWorker: {
                    select: {
                        id: true,
                        tieneCertificacion: true,
                        estaActivo: true,
                        fechaRegistro: true,

                        servicio: {
                            select: {
                                id: true,
                                nombre: true,
                                icono: true,
                                color: true
                            }
                        }
                    }
                }
            },
        });

        if (!worker) {
            return res.status(404).send({
                error: "Worker no encontrado",
            });
        }

        return res.status(200).send(worker);
    } catch (error) {
        console.error("perfilWorker error:", error);

        return res.status(500).send({
            error: "Error interno del servidor",
        });
    }
};