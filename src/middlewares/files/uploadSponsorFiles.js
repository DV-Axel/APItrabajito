// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const rootPath = path.resolve();
// const logoFolder = path.join(rootPath, "public/images/profilePictureSponsor");
// const companyRegFolder = path.join(rootPath, "public/files/companyRegistration");

// // Crear carpetas si no existen
// if ( !fs.existsSync(logoFolder) ){
//     fs.mkdirSync( logoFolder, { recursive: true } );
// }

// if ( !fs.existsSync(companyRegFolder) ){
//     fs.mkdirSync( companyRegFolder, { recursive: true } );
// }

// const storage = multer.diskStorage({
//     destination: ( req, file, cb ) => {
//         if (file.fieldname === "logo") {
//             cb(null, logoFolder);
//         } else if (file.fieldname === "companyRegistration") {
//             cb(null, companyRegFolder);
//         } else {
//             cb(null, path.join(rootPath, "public/uploads/others"));
//         }
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });


// const fileFilter = (req, file, cb) => {
//     if (file.fieldname === "logo"){
//         // Solo imágenes para Logo
//         const allowedTypes = /jpg|jpeg|png|gif/;
//         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = allowedTypes.test(file.mimetype);

//         if (extname && mimetype) {
//             return cb(null, true);
//         } else {
//             return cb(new Error("Solo se permiten imagenes con extensiones jpg, jpeg, png o gif"));
//         }
//     } else if (file.fieldname === "companyRegistration") {
//         // PDF o imagen para companyRegistration
//         const allowedTypes = /pdf|jpg|jpeg|png/;
//         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === "application/pdf";

//         if (extname && mimetype) {
//             return cb(null, true);
//         } else {
//             return cb(new Error("Solo se permiten archivos PDF o imágenes para la constancia."));
//         }
//     } else {
//         return cb(new Error('Campo de archivo no soportado'));
//     }
// };


// export const uploadSponsorFiles = multer({
//     storage,
//     limits: { fieldSize: 50 * 1024 * 1024 },
//     fileFilter
// }).fields([
//     { name: 'logo', maxCount: 1 },
//     { name: 'companyRegistration', maxCount: 1 }
// ]);

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const rootPath = path.resolve();
const tmpFolder = path.join(rootPath, 'public', 'tmp', 'sponsorFiles');

if (!fs.existsSync(tmpFolder)) {
    fs.mkdirSync(tmpFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tmpFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "logo") {
        const allowedTypes = /jpg|jpeg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        return cb(new Error("Solo se permiten imágenes jpg, jpeg, png o gif para el logo"));
    }
    if (file.fieldname === "companyRegistration") {
        const allowedTypes = /pdf|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === "application/pdf";
        if (extname && mimetype) return cb(null, true);
        return cb(new Error("Solo se permiten PDF o imágenes para la constancia"));
    }
    return cb(new Error('Campo de archivo no soportado'));
};

export const uploadSponsorFiles = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter
}).fields([
    { name: 'logo', maxCount: 1 },
    { name: 'companyRegistration', maxCount: 1 }
]);