import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Servir archivos estáticos del frontend de forma aislada
app.use(express.static(join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Servidor Ejercicio 1 corriendo en http://localhost:${PORT}`);
});