//src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import routes from './routes';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB ATLAS'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/api', routes);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
