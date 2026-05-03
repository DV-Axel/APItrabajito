import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';
import {userRouter} from './routes/user.routes.js';
import {authRouter} from './routes/auth.routes.js';
import {jobRequestRouter} from './routes/job_request.routes.js';
import {workerRouter} from './routes/worker.routes.js';
import {sponsorRouter} from './routes/sponsor.routes.js';
import {categoryRouter} from './routes/category.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Resolver __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Raíz del proyecto (un nivel arriba de src)
const projectRoot = path.join(__dirname, '..');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));

// Archivos estáticos de public (si tu carpeta public está en la raíz, usa projectRoot)
app.use('/images/profilePicture', express.static(path.join(projectRoot, 'public/images/profilePicture')));
app.use('/images/profilePictureWorker', express.static(path.join(projectRoot, 'public/images/profilePictureWorker')));
app.use('/images/jobRequests', express.static(path.join(projectRoot, 'public/images/jobRequests')));
app.use('/images/profilePictureSponsor', express.static(path.join(projectRoot, 'public/images/profilePictureSponsor')));
app.use('/files/companyRegistration', express.static(path.join(projectRoot, 'public/files/companyRegistration')));

// **Nuevo**: servir carpeta uploads desde la raíz del proyecto
app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/job-requests', jobRequestRouter);
app.use('/workers', workerRouter);
app.use('/sponsors', sponsorRouter);
app.use('/categories', categoryRouter);

app.get('/', (_req, res) => res.send('API OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server escuchando en http://localhost:${PORT}`);
});