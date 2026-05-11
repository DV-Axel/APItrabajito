// src/middlewares/images/uploadWorkerPhoto.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Definir la carpeta de destino
const rootPath = path.resolve();
const workerFolder = path.join(rootPath, "public/images/profilePictureWorker");

// Crear la carpeta si no existe
if (!fs.existsSync(workerFolder)) {
    fs.mkdirSync(workerFolder, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, workerFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Filtro de archivos permitidos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Solo se permite imágenes con extensiones jpg, jpeg, png o gif."));
    }
};

export const uploadWorkerPhoto = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter
}).fields([
    { name: "fotoPerfilWorker", maxCount: 1 }
]);