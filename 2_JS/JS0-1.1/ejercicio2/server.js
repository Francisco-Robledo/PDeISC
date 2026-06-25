import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let animales = ['Perro', 'Gato', 'Elefante', 'León'];
let compras = ['Leche', 'Pan', 'Huevos', 'Manzanas'];
let arrayMagico = ['Elemento 1', 'Elemento 2', 'Elemento 3', 'Elemento 4'];

const getEstado = () => ({ animales, compras, arrayMagico });

// --- ENDPOINTS PARA AGREGAR ---
app.post('/api/animales', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) return res.status(400).json({ error: 'Animal inválido.' });
    animales.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡${valor} agregado!` });
});

app.post('/api/compras', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) return res.status(400).json({ error: 'Producto inválido.' });
    compras.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡${valor} agregado!` });
});

app.post('/api/magico', (req, res) => {
    const { valor } = req.body;
    if (!valor || valor.trim().length < 2) return res.status(400).json({ error: 'Mínimo 2 caracteres.' });
    arrayMagico.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡${valor} agregado!` });
});

// --- ENDPOINTS DELETE (Para corregir errores específicos de tipeo) ---
app.delete('/api/animales/:index', (req, res) => {
    animales.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});

app.delete('/api/compras/:index', (req, res) => {
    compras.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});

app.delete('/api/magico/:index', (req, res) => {
    arrayMagico.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});

// --- ENDPOINTS CORE: USO DE POP() (Lo que pide el ejercicio) ---
app.post('/api/animales/pop', (req, res) => {
    if (animales.length === 0) return res.status(400).json({ error: 'El array ya está vacío.' });
    const eliminado = animales.pop();
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Animal eliminado: ${eliminado}` });
});

app.post('/api/compras/pop', (req, res) => {
    if (compras.length === 0) return res.status(400).json({ error: 'La lista está vacía.' });
    const eliminado = compras.pop();
    res.json({ success: true, eliminado, estadoGlobal: getEstado(), mensaje: 'Producto extraído.' });
});

app.post('/api/magico/vaciar', (req, res) => {
    if (arrayMagico.length === 0) return res.status(400).json({ error: 'El array ya está vacío.' });
    let eliminados = [];
    while (arrayMagico.length > 0) {
        eliminados.push(arrayMagico.pop());
    }
    res.json({ success: true, eliminados, estadoGlobal: getEstado(), mensaje: 'Array vaciado con bucle while.' });
});

app.get('/api/estado', (req, res) => {
    res.json(getEstado());
});

app.listen(PORT, () => console.log(`🚀 Ejercicio 2 activo en http://localhost:${PORT}`));