import dotenv from 'dotenv';
dotenv.config();
import { join } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mainRouter from './lib/routers/main.js';

const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const app = express();

app.use(express.json());

app.use('/api', mainRouter);

app.use(express.static('dist/app'));

app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '/app/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
