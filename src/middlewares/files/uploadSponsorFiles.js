import multer from 'multer';
const upload = multer();
export const uploadSponsorFiles = upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'companyRegistration', maxCount: 1 }
]);