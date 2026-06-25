import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3006; // Puerto 3006

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base (Estado inicial largo para que el slice se note bien)
let numeros = [10, 20, 30, 40, 50, 60, 70];
let peliculas = ['Matrix', 'Shrek', 'Avatar', 'Gladiator', 'Titanic', 'Alien'];
let items = ['Auto', 'Moto', 'Bici', 'Avión', 'Barco', 'Tren'];

const getEstado = () => ({ numeros, peliculas, items });

// --- ENDPOINTS CORE: EL MÉTODO SLICE() ---
// IMPORTANTE: slice() no muta el array original, solo devuelve la copia.

// 1. Copiar los primeros 3 (índice 0 hasta el 3 no incluido)
app.get('/api/numeros/slice', (req, res) => {
    if (numeros.length < 3) return res.status(400).json({ error: 'Faltan números para copiar 3.' });
    
    const copia = numeros.slice(0, 3);
    res.json({ success: true, copia, mensaje: 'Copia creada: Primeros 3 elementos.' });
});

// 2. Copia parcial (desde pos 2 hasta 4 no incluido -> copia el índice 2 y 3)
app.get('/api/peliculas/slice', (req, res) => {
    if (peliculas.length < 4) return res.status(400).json({ error: 'Faltan películas para llegar a la pos 4.' });
    
    const copia = peliculas.slice(2, 4);
    res.json({ success: true, copia, mensaje: 'Copia creada: Índices 2 y 3.' });
});

// 3. Copia de los últimos 3 (índice -3)
app.get('/api/items/slice', (req, res) => {
    if (items.length < 3) return res.status(400).json({ error: 'Faltan elementos para copiar 3.' });
    
    const copia = items.slice(-3);
    res.json({ success: true, copia, mensaje: 'Copia creada: Últimos 3 elementos.' });
});

// --- ENDPOINTS PARA AGREGAR ELEMENTOS (Interactividad) ---
app.post('/api/numeros', (req, res) => {
    const num = Number(req.body.valor);
    if (isNaN(num)) return res.status(400).json({ error: 'Inválido.' });
    numeros.push(num);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Número agregado.` });
});

app.post('/api/peliculas', (req, res) => {
    if (!req.body.valor) return res.status(400).json({ error: 'Película inválida.' });
    peliculas.push(req.body.valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Película agregada.` });
});

app.post('/api/items', (req, res) => {
    if (!req.body.valor) return res.status(400).json({ error: 'Item inválido.' });
    items.push(req.body.valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Ítem agregado.` });
});

// --- ENDPOINTS DELETE (Corrección) ---
app.delete('/api/numeros/:index', (req, res) => {
    numeros.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});
app.delete('/api/peliculas/:index', (req, res) => {
    peliculas.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});
app.delete('/api/items/:index', (req, res) => {
    items.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});

// ESTADO INICIAL
app.get('/api/estado', (req, res) => res.json(getEstado()));

app.listen(PORT, () => console.log(`🚀 Ejercicio 6 activo en http://localhost:${PORT}`));