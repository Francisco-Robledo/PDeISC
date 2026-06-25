import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3007; // Puerto 3007

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base (Con los elementos requeridos por la consigna ya cargados)
let palabras = ['gato', 'loro', 'perro', 'conejo'];
let numeros = [10, 20, 50, 40, 90];
let ciudades = ['Barcelona', 'Sevilla', 'Madrid', 'Valencia'];

const getEstado = () => ({ palabras, numeros, ciudades });

// --- ENDPOINTS CORE: EL MÉTODO indexOf() ---

app.get('/api/palabras/buscar', (req, res) => {
    // indexOf es sensible a mayúsculas y minúsculas (Case Sensitive)
    const index = palabras.indexOf('perro'); 
    
    if (index !== -1) {
        res.json({ success: true, index, mensaje: `¡Encontrado! 'perro' está en la posición [${index}].` });
    } else {
        res.json({ success: false, index: -1, mensaje: `No encontrado. 'perro' no existe en el array (-1).` });
    }
});

app.get('/api/numeros/buscar', (req, res) => {
    // Busca estrictamente el número 50 (tipo Number)
    const index = numeros.indexOf(50);
    
    if (index !== -1) {
        res.json({ success: true, index, mensaje: `El número 50 se verificó en la posición [${index}].` });
    } else {
        res.json({ success: false, index: -1, mensaje: `El número 50 no está en el array (-1).` });
    }
});

app.get('/api/ciudades/buscar', (req, res) => {
    const index = ciudades.indexOf('Madrid');
    
    if (index !== -1) {
        res.json({ success: true, index, mensaje: `Índice de 'Madrid': [${index}]` });
    } else {
        // Mensaje personalizado exigido por la consigna
        res.json({ success: false, index: -1, mensaje: `Aviso: La ciudad de 'Madrid' no se encuentra en el registro.` });
    }
});

// --- ENDPOINTS PARA AGREGAR ELEMENTOS (Interactividad) ---
app.post('/api/palabras', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ]+$/.test(valor)) return res.status(400).json({ error: 'Solo una palabra.' });
    palabras.push(valor.trim().toLowerCase()); // Guardamos en minúscula para facilitar la búsqueda
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Palabra agregada.` });
});

app.post('/api/numeros', (req, res) => {
    const num = Number(req.body.valor);
    if (isNaN(num)) return res.status(400).json({ error: 'Inválido.' });
    numeros.push(num);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Número agregado.` });
});

app.post('/api/ciudades', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) return res.status(400).json({ error: 'Ciudad inválida.' });
    
    // Capitalizar primera letra para que coincida con 'Madrid' exacto si lo escriben en minúscula
    const formatCiudad = valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
    ciudades.push(formatCiudad);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Ciudad agregada.` });
});

// --- ENDPOINTS DELETE (Corrección y testeo de -1) ---
app.delete('/api/palabras/:index', (req, res) => {
    palabras.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Palabra eliminada.' });
});
app.delete('/api/numeros/:index', (req, res) => {
    numeros.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Número eliminado.' });
});
app.delete('/api/ciudades/:index', (req, res) => {
    ciudades.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Ciudad eliminada.' });
});

// ESTADO INICIAL
app.get('/api/estado', (req, res) => res.json(getEstado()));

app.listen(PORT, () => console.log(`🚀 Ejercicio 7 activo en http://localhost:${PORT}`));