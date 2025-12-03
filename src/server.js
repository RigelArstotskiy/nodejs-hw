import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errors } from 'celebrate';

import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

//GENERAL MIDDLEWARE
app.use(logger);
app.use(express.json());
app.use(cors());

//ROUTES
app.use(notesRoutes);

//ERROR MIDDLEWARE
app.use(errors());
app.use(notFoundHandler); //status 404
app.use(errorHandler); //status 500

//CONNECT TO MONGO
await connectMongoDB();

//START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
