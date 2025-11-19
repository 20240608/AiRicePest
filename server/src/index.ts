import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createDatabasePool } from './db.js';
import { registerRoutes } from './routes.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  }),
);

const db = createDatabasePool();

// Root path
app.get('/', (_req, res) => {
  res.json({ 
    service: 'airicepest-backend',
    version: '0.1.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      api: '/api/*'
    }
  });
});

// Favicon handler (return 204 No Content to avoid CSP errors)
app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

// health
app.get('/api/health', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ ok: true, service: 'airicepest-backend' });
});

registerRoutes(app, db, upload);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});


