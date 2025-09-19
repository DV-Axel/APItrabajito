import { error } from 'console';
import fs from 'fs';
import path from 'path';


/**
 * Borra archivos del disco.
 * @param {Array} files - Array de archivos Multer (req.files)
 * @param {String} baseDir - Directorio base (por defecto, process.cwd())
 */


export function deleteUploadedFiles(files, baseDir = process.cwd() ){
    if( !files || files.length === 0) return;

    files.forEach( file => {
        const filePath = path.isAbsolute(file.path)
            ? file.path
            : path.join( baseDir, file.path );
        fs.unlink(filePath, err => {
            if (err) console.error(`Error al borrar archivo ${filePath}:`, err.message );
        });
    });
}