import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual compatible con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor local
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` Servidor corriendo exitosamente.`);
    console.log(` Accede a la aplicación en: http://localhost:${PORT}`);
    console.log(`==================================================\n`);
});
