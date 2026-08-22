import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Enable CORS allowing configured frontend origin
app.use(
  cors({
    origin: [config.frontendUrl, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Dayflow HRMS API', timestamp: new Date() });
});

// Primary API Routes
app.use('/api', routes);

// Centralized Error Middleware
app.use(errorHandler);

export default app;
