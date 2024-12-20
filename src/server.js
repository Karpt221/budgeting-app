import { join } from 'path';  
import { fileURLToPath } from 'url';  
import express from 'express';  
import router from './lib/router.js';  
import dotenv from 'dotenv'; 

dotenv.config();  
const { PORT = 3001 } = process.env;  

// Get the `__dirname` equivalent in ES modules  
const __filename = fileURLToPath(import.meta.url);  
const __dirname = join(__filename, '..');  

const app = express();  

// Middleware that parses JSON and looks at requests where the Content-Type header matches the type option  
app.use(express.json());  

// Serve API requests from the router  
app.use('/api', router);  

// Serve app production bundle  
app.use(express.static('dist/app'));  

// Handle client routing, return all requests to the app  
app.get('*', (_req, res) => {  
  res.sendFile(join(__dirname, 'dist/app/index.html'));  
});  

const server = app.listen(PORT, () => {  
  console.log(`Server listening at http://localhost:${PORT}`);  
});

// Handle termination signals to clean up the process  
const shutdown = () => {  
  console.log('Shutting down server...');  
  server.close(() => {  
    console.log('Server closed');  
    process.exit(0);  
  });  
};  

process.on('SIGINT', shutdown); // Handle Ctrl+C or terminal close  
process.on('SIGTERM', shutdown); // Handle termination signals  