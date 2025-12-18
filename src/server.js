//npm packts import
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

//middleware elements import
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
//celebrate import
import { errors } from 'celebrate';
//routing element import
import notesRoutes from './routes/notesRoutes.js';
//auth routes logic import
import authRoutes from './routes/authRoutes.js';
//parser
import cookieParser from 'cookie-parser';
//avatar-change and add logic
import userRoutes from './routes/userRoutes.js';
//initialize express app and server port
const app = express();
const PORT = process.env.PORT ?? 3000;

//GENERAL MIDDLEWARE
app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//ROUTES
app.use(authRoutes);
app.use(notesRoutes);
app.use(userRoutes);

//ERROR MIDDLEWARE
app.use(notFoundHandler); //status 404
app.use(errors());
app.use(errorHandler); //status 500

//CONNECT TO MONGO
await connectMongoDB();

//START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
