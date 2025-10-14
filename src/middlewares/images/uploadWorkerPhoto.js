// import multer from 'multer';
// const upload = multer();


// export const uploadWorkerPhoto = upload.fields([
//     { name: 'photo', maxCount: 1 },
// ]);

import multer from "multer";
import path from 'path';
import fs from 'fs';

const rootPath = path.resolve();
const tmpFolder = path.join(rootPath, 'public', 'images', 'profilePictureWorker', 'tmp');

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
    const allowedTypes = /jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permite imágenes con extensiones jpg, jpeg, png o gif'))
    }
};

export const uploadProfilePictureWorkerMiddle = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter
});