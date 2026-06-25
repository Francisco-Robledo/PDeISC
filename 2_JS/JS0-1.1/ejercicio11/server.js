import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3011; // Puerto 3011

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base (Mezclados para que el filter tenga sentido)
let numeros = [5, 12, 8, 25, 3, 15];
let palabras = ['sol', 'computadora', 'mar', 'elefante', 'tren'];
let usuarios = [
    { nombre: 'Ana', activo: true },
    { nombre: 'Juan', activo: false },
    { nombre: 'Lucía', activo: true }
];

const getEstado = () => ({ numeros, palabras, usuarios });

// --- ENDPOINTS CORE: EL MÉTODO filter() ---

// 1. Filtrar números mayores a 10
app.get('/api/numeros/filter', (req, res) => {
    // filter() guarda solo los elementos donde la condición da 'true'
    const filtrados = numeros.filter(num => num > 10);
    res.json({ success: true, resultado: filtrados, mensaje: `Filtrados ${filtrados.length} números mayores a 10.` });
});

// 2. Filtrar palabras con más de 5 letras
app.get('/api/palabras/filter', (req, res) => {
    const filtradas = palabras.filter(palabra => palabra.length > 5);
    res.json({ success: true, resultado: filtradas, mensaje: `Encontradas ${filtradas.length} palabras largas.` });
});

// 3. Filtrar usuarios activos
app.get('/api/usuarios/filter', (req, res) => {
    // Busca objetos donde la propiedad 'activo' sea true
    const activos = usuarios.filter(usuario => usuario.activo === true);
    res.json({ success: true, resultado: activos, mensaje: `Hay ${activos.length} usuarios activos.` });
});


// --- ENDPOINTS PARA AGREGAR ELEMENTOS (POST) ---
app.post('/api/numeros', (req, res) => {
    const num = Number(req.body.valor);
    if (isNaN(num)) return res.status(400).json({ error: 'Debe ser numérico.' });
    numeros.push(num);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Número guardado.` });
});

app.post('/api/palabras', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ]+$/.test(valor)) return res.status(400).json({ error: 'Solo una palabra (sin espacios).' });
    palabras.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Palabra agregada.` });
});

app.post('/api/usuarios', (req, res) => {
    const { nombre, activo } = req.body;
    if (!nombre || !/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) return res.status(400).json({ error: 'Nombre inválido.' });
    
    // Lo guardamos como objeto Booleano
    usuarios.push({ nombre: nombre.trim(), activo: activo === 'true' });
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Usuario registrado.` });
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
app.delete('/api/usuarios/:index', (req, res) => {
    usuarios.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});

app.get('/api/estado', (req, res) => res.json(getEstado()));

app.listen(PORT, () => console.log(`🚀 Ejercicio 11 activo en http://localhost:${PORT}`));