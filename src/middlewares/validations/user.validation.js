import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(45, "El nombre no puede superar los 45 caracteres"),
    
    lastName: z.string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(70, "El apellido no puede superar los 70 caracteres"),
    
    dni: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(15, "El nombre no puede superar los 45 caracteres"),
    
    idType: z.string()
        .min(2, "El tipo de documento es obligatorio"),
    
    email: z.email(),

    birthDate: z.coerce.date({
        invalid_type_error: "La fecha de nacimiento no es válida",
    }),

    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(255, "La contraseña no debe superar los 255 caracteres"),

    phone: z.string()
        .min(8, "El número de teléfono debe tener al menos 8 dígitos"),

    registrationDate: z.date()
        .optional(),

    isVerified: z.boolean().default(false),

    address: z.string()
        .min(3, "La dirección debe tener al menos 5 caracteres")
        .max(60, "La dirección no puede superar los 60 caracteres"),

    number: z.string()
        .max(10, "El número no puede superar los 10 caracteres"),

    postalCode: z.string()
        .min(1, "El código postal es obligatorio")
        .max(10, "El código postal no puede superar los 10 caracteres"),

    departmentNumber: z.string()
        .max(10, "El número de departamento no puede superar los 10 caracteres")
        .optional(),

    profilePicture: z.string()
        .optional(),
});

// para crear un usuario (todos oblitatorios salvo las opcionales del modelo)
export const createUserSchema = userSchema;

// para actualizar (todos opcionales)
export const updateUserSchema = userSchema.partial();

// Para validar ID en params
export const userIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número"),
});