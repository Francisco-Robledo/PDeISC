import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4003; // Puerto 4003

app.use(express.static(path.join(__dirname, 'public')));

// El servidor solo sirve la app, el almacenamiento ocurre en el navegador (Local Storage)
// Usamos una Expresión Regular /.*/ en lugar del string '*' para soportar Express 5
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Proyecto LocalStorage activo en http://localhost:${PORT}`));