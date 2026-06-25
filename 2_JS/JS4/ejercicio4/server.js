// Importación de módulos para Node con ES Modules
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3004;

// --- BASE DE DATOS SIMULADA (Para nuestra API Local) ---
const alumnosDB = [
    { id: 1, nombre: "Ana Gómez", curso: "Desarrollo Web", promedio: 9.5 },
    { id: 2, nombre: "Carlos Ruiz", curso: "JavaScript ES6", promedio: 8.0 },
    { id: 3, nombre: "María Paz", curso: "Bases de Datos", promedio: 10.0 },
    { id: 4, nombre: "Juan Díaz", curso: "React.js", promedio: 7.5 }
];

// Configuración para servir la carpeta frontend
app.use(express.static(path.join(__dirname, 'public')));

// --- NUESTRA API LOCAL (Punto 4) ---
// Endpoint que devuelve los datos de los alumnos en formato JSON
app.get('/api/alumnos', (req, res) => {
    // Retornamos nuestra base de datos simulada
    res.json(alumnosDB);
});

// Ruta raíz para servir el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicializar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});