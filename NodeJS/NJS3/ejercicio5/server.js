import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración necesaria para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Servidor corriendo con módulos en http://localhost:${PORT}`);
});