import multer from "multer";
import path from 'path';
import fs from 'fs';

const rootPath = path.resolve();
const profileFolder = path.join(rootPath, 'public/images/profilePicture');

if( !fs.existsSync( profileFolder )){
    fs.mkdirSync( profileFolder, { recursive: true } );
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb( null, profileFolder );
    },
    filename: (req, file, cb) => {
        cb( null, Date.now() + '-' + file.originalname );
    }
});

const fileFilter = ( req, file, cb ) => {
    const allowedTypes = /jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname( file.originalname ).toLowerCase());
    const mimetype = allowedTypes.test( file.mimetype );

    if ( extname && mimetype ) {
        return cb(null, true);
    } else {
        cb( new Error('Solo se permite imágenes con extensiones jps, jpeg, png o gif.'));
    }
};

export const uploadProfilePicture = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter
});
