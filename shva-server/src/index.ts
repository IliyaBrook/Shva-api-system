import 'dotenv/config';
import errorMiddleware from '@/middlewares/error-middleware'
import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router/index';
import { sequelize } from './database/db';

const PORT: number = Number(process.env.PORT) || 5000;
const app: express.Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: true,
  allowedHeaders: ['Origin', 'Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Set-Cookie'],
  methods: ['GET', 'POST'],
}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server running at PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

void start();