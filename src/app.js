import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router, { userRouter } from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/images', express.static('public/images'));

app.use('/users', userRouter);
app.use('/auth', authRouter)


app.get('/', (_req, res) => res.send('API OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server escuchando en http://localhost:${PORT}`);
});
