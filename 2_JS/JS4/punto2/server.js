// Importar módulos usando sintaxis ES6
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname en un entorno de ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`// Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`// Presiona Ctrl + C para detenerlo.`);
});
