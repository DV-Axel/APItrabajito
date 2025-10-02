import { z } from "zod";




export const userSchema = z.object({
    firstName: z.string({
        required_error: "El nombre es obligatorio"
    })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(45, "El nombre no puede superar los 45 caracteres"),

    lastName: z.string({
        required_error: "El apellido es obligatorio"
    })
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(70, "El apellido no puede superar los 70 caracteres"),

    dni: z.string({
        required_error: "El documento es obligatorio"
    })
    .min(2, "El documento debe tener al menos 2 caracteres")
    .max(15, "El documento no puede superar los 15 caracteres"),

    idType: z.string({
        required_error: "El tipo de documento es obligatorio"
    }),

    email: z.string({
        required_error: "El email es obligatorio"
    })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email no es válido"),

    birthDate: z.string({
        required_error: "La fecha de nacimiento es obligatoria"
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de nacimiento debe tener formato YYYY-MM-DD")
    .transform(str => new Date(str))
    .refine(
        date => date instanceof Date && !isNaN(date.getTime()),
        "La fecha de nacimiento no es válida"
    )
    .refine(
        date => date.getFullYear() > 1900 && date.getFullYear() < new Date().getFullYear(),
        "La fecha de nacimiento debe ser realista"
    ),

    password: z.string({
        required_error: "La contraseña es obligatoria"
    })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(255, "La contraseña no debe superar los 255 caracteres"),

    phone: z.string({
        required_error: "El número de teléfono es obligatorio"
    })
    .min(8, "El número de teléfono debe tener al menos 8 dígitos"),

    registrationDate: z.coerce.date().optional(),

    isVerified: z.coerce.boolean().default(false),

    address: z.string({
        required_error: "La dirección es obligatoria"
    })
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(60, "La dirección no puede superar los 60 caracteres"),

    number: z.string({
        required_error: "El número es obligatorio"
    })
    .max(10, "El número no puede superar los 10 caracteres")
    .regex(/^\d+$/, "El número debe contener solo dígitos"),

    postalCode: z.string({
        required_error: "El código postal es obligatorio"
    })
    .max(10, "El código postal no puede superar los 10 caracteres"),

    departmentNumber: z.string()
        .max(10, "El número de departamento no puede superar los 10 caracteres")
        .optional(),

    profilePicture: z.string().optional(),
});

// para crear un usuario (todos obligatorios salvo las opcionales del modelo)
export const createUserSchema = userSchema;

// para actualizar (todos opcionales)
export const updateUserSchema = userSchema.partial();

// Para validar ID en params
export const idSchema = z.object({
    id: z.string({
        required_error: "El ID es obligatorio"
    }).regex(/^\d+$/, "El ID debe ser un número"),
});


export const loginSchema = z.object({
    email: z.string({
        required_error: "El email es obligatorio"
    })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email no es válido"),

    password: z.string({
        required_error: "La constraseña es obligatorioa"
    })    
    .min(1, "La contraseña es obligatoria")
});