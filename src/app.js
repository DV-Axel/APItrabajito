import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { jobRequestRouter } from './routes/job_request.routes.js';
import { workerRouter } from './routes/worker.routes.js';
import { sponsorRouter } from './routes/sponsor.routes.js';
import { categoryRouter } from './routes/category.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/images/profilePicture', express.static('public/images/profilePicture'));
app.use('/images/jobRequests', express.static('public/images/jobRequests'));
app.use('/images/profilePictureSponsor', express.static('public/images/profilePictureSponsor'));
app.use('/files/companyRegistration', express.static('public/files/companyRegistration'));


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
