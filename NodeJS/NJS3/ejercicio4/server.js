import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreamos __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Servidor corriendo con módulos en http://localhost:${PORT}`);
});