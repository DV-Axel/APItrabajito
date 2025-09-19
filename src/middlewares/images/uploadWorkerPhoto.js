import multer from 'multer';
const upload = multer();
export const uploadWorkerPhoto = upload.fields([
    { name: 'photo', maxCount: 1 },
]);