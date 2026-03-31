import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Render assigns a dynamic port via process.env.PORT
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Example API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running correctly on Render!' });
});

// Serve frontend built files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for React Router / SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
