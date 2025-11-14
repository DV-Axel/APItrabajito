import { prisma } from "../data/prisma.js";
import { deleteUploadedFiles } from "../utils/fileUtils.js";
import { uploadToSupabase } from "../utils/updateToSupabase.js";


export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        if( users.length === 0 ) return res.json({ message: 'No hay usuarios registrados'});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
}

// javascript
export const updateDataUser = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({ message: "El id debe ser un número válido" });
    }

    const { atributo } = req.body;
    if (!atributo) {
        return res.status(400).json({ message: "Falta el campo 'atributo' en el body" });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!existingUser) return res.status(404).json({ error: "Usuario no encontrado" });

        const updateData = {};

        if (atributo === 'address') {
            // Espera body con { atributo, address, number, departmentNumber? }
            const { address, number, departmentNumber } = req.body;
            if (address === undefined || address === null || String(address).trim() === '') {
                return res.status(400).json({ error: "Falta el campo 'address' para actualizar" });
            }
            if (number === undefined || number === null || String(number).trim() === '') {
                return res.status(400).json({ error: "Falta el campo 'number' para actualizar" });
            }

            updateData.address = String(address);
            // en la BD 'number' es String, se guarda como tal
            updateData.number = String(number);
            // Si viene explícito null se respeta, si viene undefined se deja null
            updateData.departmentNumber = departmentNumber === undefined ? null : departmentNumber;
        } else if (atributo === 'phone') {
            // Espera body con { atributo, valor }
            const { valor } = req.body;
            if (valor === undefined) return res.status(400).json({ error: "Falta el campo 'valor' para phone" });
            const phoneNum = Number(valor);
            if (isNaN(phoneNum)) return res.status(400).json({ error: "El valor de phone debe ser numérico" });
            updateData.phone = phoneNum;
        } else if (
            atributo === 'postalCode' ||
            atributo === 'postal' ||
            atributo === 'postal_code' ||
            atributo === 'codigoPostal' ||
            atributo === 'codigoPosta'
        ) {
            const { valor } = req.body;
            if (valor === undefined) return res.status(400).json({ error: "Falta el campo 'valor' para postal code" });
            updateData.postalCode = String(valor);
        } else {
            return res.status(400).json({ error: "Atributo no soportado para actualización" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: updateData
        });

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error en updateDataUser:", error);
        res.status(500).json({ error: "Error al actualizar usuario", details: error.message });
    }
};



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

        res.status(200).json(user);

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
    if( lastName !== undefined ) updateData.lastName = lastName;
    if( dni !== undefined ) updateData.dni = dni;
    if( idType !== undefined ) updateData.idType = idType;
    if( birthDate !== undefined ) updateData.birthDate = new Date(birthDate);
    if( phone !== undefined ) updateData.phone = Number(phone);
    if( address !== undefined ) updateData.address = address;
    if( number !== undefined ) updateData.number = number;
    if( postalCode !== undefined ) updateData.postalCode = postalCode;
    if( deparmentNumber !== undefined ) updateData.deparmentNumber = deparmentNumber;

    try {
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if(!user) return res.status(404).json( { error: "Usuario no encontrado" } );

        const updateUser = await prisma.user.update( {  
            where: { id: Number(id) },
            data: updateData
        });

        res.json({ sucess: true, user: updateUser });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error al actualizar usuario", details: error.message });
    }

}



// METODO QUE USA LOCAL
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
        if (req.file) {
            deleteUploadedFiles([req.file]);
        }
        res.status(500).json( { error: error.message });
    }
}



// METODO QUE USA SUPABASE
// export const updateProfilePicture = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!req.file) {
//             return res.status(400).json( { error: 'No se subió ninguna imagen' } );
//         }
//         //const imagePath = `/images/profilePicture/${req.file.filename}`;
        
//         // Subir imagen a Supabase Storage usando la funcion utilitaria

//         const imageUrl = await uploadToSupabase({
//             bucket: 'profile-pictures',
//             filePath: req.file.path,
//             destinationPath: `${id}/${req.file.filename}`,
//             mimetype: req.file.mimetype
//         })

//         const user = await prisma.user.update({
//             where: { id: Number(id) },
//             data: { profilePicture: imageUrl }
//         }); 

//         res.json( { sucess: true, imageUrl, user });
//     } catch (error) {
//         if (req.file) {
//             deleteUploadedFiles([req.file]);
//         }
//         res.status(500).json( { error: error.message });
//     }
// }




// para este metotdo es necesario agregar una columna en user (isActive), falta armar la ruta tambien
export const desactivateAccount = async(req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json( { message: "El id debe ser un número válido"} )
    };

    try {

        // Verifica si el usuario existe
        const existingUser = await prisma.findUnique({ 
            where: { id: Number(id) } 
        });
        if (!existingUser) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Verifica si ya esta desactivado
        if (!existingUser.isActive) {
            return res.status(400).json({ message: "La cuenta ya está desactivada" });
        }

        const user = await prisma.user.update({ 
            where: { id: Number(id) },
            data: { isVerified: false } 
        });
        
        res.status(200).json({ 
            message: "Cuenta desactivada correctamente",
            user });
    } catch (error) {
        res.status(500).json( { error: "Error al actualizar el stato", details: error.message });
    }
}


export const selectWorker = async (req, res) => {
    const { jobRequestId, postulationId } = req.body;

    if (!jobRequestId || !postulationId) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    try {
        const jobRequest = await prisma.jobRequest.update({
            where: { id: Number(jobRequestId) },
            data: { applicationSelectedId: Number(postulationId) }
        });

        res.status(200).json({ message: "Postulación seleccionada correctamente", jobRequest });
    } catch (error) {
        res.status(500).json({ error: "Error al seleccionar la postulación", details: error.message });
    }
};
