import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3012; // Puerto 3012

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base
let numSuma = [15, 25, 10];
let numMulti = [2, 3, 4, 5];
let productos = [
    { nombre: 'Mouse', precio: 2500 },
    { nombre: 'Teclado', precio: 4500 }
];

const getEstado = () => ({ numSuma, numMulti, productos });

// --- ENDPOINTS CORE: EL MÉTODO reduce() ---

// 1. Sumar todo
app.get('/api/suma/reduce', (req, res) => {
    if (numSuma.length === 0) return res.status(400).json({ error: 'No hay números para sumar.' });
    
    // reduce(acumulador, elementoActual) -> arranca el acumulador en 0
    const totalSuma = numSuma.reduce((acc, curr) => acc + curr, 0);
    
    res.json({ success: true, resultado: totalSuma, mensaje: '¡Suma total calculada!' });
});

// 2. Multiplicar todo
app.get('/api/multi/reduce', (req, res) => {
    if (numMulti.length === 0) return res.status(400).json({ error: 'No hay números para multiplicar.' });
    
    // Arranca el acumulador en 1 (porque si fuera 0, cualquier multiplicación daría 0)
    const totalMulti = numMulti.reduce((acc, curr) => acc * curr, 1);
    
    res.json({ success: true, resultado: totalMulti, mensaje: '¡Multiplicación total calculada!' });
});

// 3. Sumar propiedades de objetos
app.get('/api/productos/reduce', (req, res) => {
    if (productos.length === 0) return res.status(400).json({ error: 'No hay productos en el carrito.' });
    
    // Acumula sumando SOLO la propiedad .precio de cada objeto
    const totalPrecios = productos.reduce((acc, producto) => acc + producto.precio, 0);
    
    res.json({ success: true, resultado: totalPrecios, mensaje: '¡Total del carrito calculado!' });
});


// --- ENDPOINTS PARA AGREGAR ELEMENTOS (POST) ---
app.post('/api/suma', (req, res) => {
    const num = Number(req.body.valor);
    if (isNaN(num)) return res.status(400).json({ error: 'Debe ser numérico.' });
    numSuma.push(num);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Número agregado a la suma.` });
});

app.post('/api/multi', (req, res) => {
    const num = Number(req.body.valor);
    if (isNaN(num)) return res.status(400).json({ error: 'Debe ser numérico.' });
    numMulti.push(num);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Número agregado a la multiplicación.` });
});

app.post('/api/productos', (req, res) => {
    const { nombre, precio } = req.body;
    const precioNum = Number(precio);
    if (!nombre || !/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) return res.status(400).json({ error: 'Nombre inválido.' });
    if (isNaN(precioNum) || precioNum <= 0) return res.status(400).json({ error: 'Precio inválido.' });
    
    productos.push({ nombre: nombre.trim(), precio: precioNum });
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Producto agregado.` });
});

// --- ENDPOINTS DELETE (Corrección) ---
app.delete('/api/suma/:index', (req, res) => {
    numSuma.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});
app.delete('/api/multi/:index', (req, res) => {
    numMulti.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});
app.delete('/api/productos/:index', (req, res) => {
    productos.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});

app.get('/api/estado', (req, res) => res.json(getEstado()));

app.listen(PORT, () => console.log(`🚀 Ejercicio 12 activo en http://localhost:${PORT}`));