import multer from "multer";
import path from 'path';
import fs from 'fs';

const rootPath = path.resolve();
const jobRequestsFolder = path.join(rootPath, 'public/images/jobRequests');

if( !fs.existsSync( jobRequestsFolder )){
    fs.mkdirSync( jobRequestsFolder, { recursive: true } );
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb( null, jobRequestsFolder );
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

export const uploadJobRequestPhotos = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter
});
