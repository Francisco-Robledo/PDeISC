import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3013; // Puerto 3013

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base desordenados intencionalmente
let numeros = [42, 7, 100, 15, 23];
let palabras = ['Zorro', 'árbol', 'Gato', 'zapato', 'Barco'];
let personas = [
    { nombre: 'Lucas', edad: 40 },
    { nombre: 'Ana', edad: 22 },
    { nombre: 'Pedro', edad: 35 }
];

const getEstado = () => ({ numeros, palabras, personas });

// --- ENDPOINTS CORE: EL MÉTODO sort() ---

// 1. Ordenar números (Menor a Mayor)
app.get('/api/numeros/sort', (req, res) => {
    // Si no le pasamos (a,b)=>a-b, el 100 iría antes que el 23 porque empieza con '1'
    numeros.sort((a, b) => a - b);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Números ordenados (Menor a Mayor).' });
});

// 2. Ordenar palabras (Alfabéticamente)
app.get('/api/palabras/sort', (req, res) => {
    // localeCompare ayuda a ordenar bien las tildes y diferencias de mayúsculas en español
    palabras.sort((a, b) => a.localeCompare(b, 'es'));
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Palabras ordenadas (A - Z).' });
});

// 3. Ordenar objetos por una propiedad (edad)
app.get('/api/personas/sort', (req, res) => {
    // Igual que los números, restamos la propiedad edad de a y b
    personas.sort((a, b) => a.edad - b.edad);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Personas ordenadas por edad (Jóvenes primero).' });
});

// --- ENDPOINTS PARA AGREGAR ELEMENTOS ---
app.post('/api/numeros', (req, res) => {
    const num = Number(req.body.valor);
    if (isNaN(num)) return res.status(400).json({ error: 'Debe ser numérico.' });
    numeros.push(num);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Número agregado.` });
});

app.post('/api/palabras', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ]+$/.test(valor)) return res.status(400).json({ error: 'Solo una palabra.' });
    palabras.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Palabra agregada.` });
});

app.post('/api/personas', (req, res) => {
    const { nombre, edad } = req.body;
    const edadNum = Number(edad);
    if (!nombre || !/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) return res.status(400).json({ error: 'Nombre inválido.' });
    if (isNaN(edadNum) || edadNum <= 0) return res.status(400).json({ error: 'Edad inválida.' });
    
    personas.push({ nombre: nombre.trim(), edad: edadNum });
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Persona agregada.` });
});

// --- ENDPOINTS DELETE (Corrección) ---
app.delete('/api/numeros/:index', (req, res) => {
    numeros.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});
app.delete('/api/palabras/:index', (req, res) => {
    palabras.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});
app.delete('/api/personas/:index', (req, res) => {
    personas.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});

app.get('/api/estado', (req, res) => res.json(getEstado()));

app.listen(PORT, () => console.log(`🚀 Ejercicio 13 activo en http://localhost:${PORT}`));