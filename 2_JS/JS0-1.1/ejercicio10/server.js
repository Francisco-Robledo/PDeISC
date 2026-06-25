import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3010; // Puerto 3010

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base (Originales que no deben ser mutados por map)
let numeros = [2, 5, 10];
let nombres = ['Ana', 'Juan pablo', 'Lucía'];
let precios = [1000, 2500, 500]; // Precios en bruto (sin IVA)

const getEstado = () => ({ numeros, nombres, precios });

// --- ENDPOINTS CORE: EL MÉTODO map() ---

// 1. Multiplicar por 3
app.get('/api/numeros/map', (req, res) => {
    if (numeros.length === 0) return res.status(400).json({ error: 'Array vacío.' });
    
    // map(): Crea un nuevo array multiplicando todo por 3
    const mapeado = numeros.map(num => num * 3);
    
    res.json({ success: true, resultado: mapeado, mensaje: '¡Números multiplicados x3!' });
});

// 2. Convertir a Mayúsculas
app.get('/api/nombres/map', (req, res) => {
    if (nombres.length === 0) return res.status(400).json({ error: 'Array vacío.' });
    
    // map(): Transforma cada string a mayúscula
    const mapeado = nombres.map(nombre => nombre.toUpperCase());
    
    res.json({ success: true, resultado: mapeado, mensaje: '¡Nombres convertidos a MAYÚSCULAS!' });
});

// 3. Agregar 21% de IVA
app.get('/api/precios/map', (req, res) => {
    if (precios.length === 0) return res.status(400).json({ error: 'Array vacío.' });
    
    // map(): Calcula el IVA y lo formatea a 2 decimales
    const mapeado = precios.map(precio => {
        const conIva = precio * 1.21;
        return Number(conIva.toFixed(2)); // Mantiene el tipo Number pero recorta decimales
    });
    
    res.json({ success: true, resultado: mapeado, mensaje: '¡21% de IVA aplicado a todos los precios!' });
});


// --- ENDPOINTS PARA AGREGAR ELEMENTOS (Interactividad) ---
app.post('/api/numeros', (req, res) => {
    const num = Number(req.body.valor);
    if (isNaN(num)) return res.status(400).json({ error: 'Debe ser numérico.' });
    numeros.push(num);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Número agregado.` });
});

app.post('/api/nombres', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) return res.status(400).json({ error: 'Nombre inválido.' });
    nombres.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Nombre agregado.` });
});

app.post('/api/precios', (req, res) => {
    const precio = Number(req.body.valor);
    if (isNaN(precio) || precio <= 0) return res.status(400).json({ error: 'Debe ser un precio mayor a 0.' });
    precios.push(precio);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Precio base guardado.` });
});

// --- ENDPOINTS DELETE (Crucecita 'X') ---
app.delete('/api/numeros/:index', (req, res) => {
    numeros.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});
app.delete('/api/nombres/:index', (req, res) => {
    nombres.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});
app.delete('/api/precios/:index', (req, res) => {
    precios.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});

app.get('/api/estado', (req, res) => res.json(getEstado()));

app.listen(PORT, () => console.log(`🚀 Ejercicio 10 activo en http://localhost:${PORT}`));