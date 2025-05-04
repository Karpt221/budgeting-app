import dotenv from 'dotenv';
dotenv.config();
import { join } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mainRouter from './lib/routers/mainRouter.js';

const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const app = express();

app.use((req, res, next) => {
  console.log('Request received:', req.method, req.originalUrl, 'Base URL:', req.baseUrl);
  next();
});

app.use(express.json());

app.use('/api', mainRouter);

app.use(express.static('dist/app'));

app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '/app/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({error:err , message: 'Internal server error' });
});

app.listen(PORT,'::', () => {
  console.log(`Server is running on http://${process.env.HOSTNAME}:${PORT}`);
});
