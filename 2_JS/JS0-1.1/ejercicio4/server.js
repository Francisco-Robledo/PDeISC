import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3004; // Puerto 3004

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base (Estado inicial)
let numeros = [10, 20, 30, 40, 50];
let mensajes = ['Hola, ¿tienen stock?', 'Sí, claro.', 'Genial, quiero 2 unidades.'];
let clientes = ['Ana', 'Carlos', 'Beatriz', 'Diego'];

const getEstado = () => ({ numeros, mensajes, clientes });

// --- ENDPOINTS PARA AGREGAR ELEMENTOS ---
app.post('/api/numeros', (req, res) => {
    const nuevoNumero = Number(req.body.valor);
    if (isNaN(nuevoNumero)) return res.status(400).json({ error: 'Debe ser un número entero.' });
    numeros.push(Math.floor(nuevoNumero)); // Aseguramos que sea entero
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡Número ${nuevoNumero} agregado!` });
});

app.post('/api/mensajes', (req, res) => {
    const { valor } = req.body;
    if (!valor || valor.trim().length < 2) return res.status(400).json({ error: 'Mensaje muy corto.' });
    mensajes.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: '¡Mensaje enviado!' });
});

app.post('/api/clientes', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) return res.status(400).json({ error: 'Nombre inválido.' });
    clientes.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡${valor} sumado a la fila!` });
});

// --- ENDPOINTS CORE: USO DE SHIFT() (Extraer el primero) ---
app.post('/api/numeros/shift', (req, res) => {
    if (numeros.length === 0) return res.status(400).json({ error: 'El array ya está vacío.' });
    const eliminado = numeros.shift();
    res.json({ success: true, extraido: eliminado, estadoGlobal: getEstado(), mensaje: `Primer número quitado: ${eliminado}` });
});

app.post('/api/mensajes/shift', (req, res) => {
    if (mensajes.length === 0) return res.status(400).json({ error: 'No hay mensajes en el chat.' });
    const eliminado = mensajes.shift();
    res.json({ success: true, extraido: eliminado, estadoGlobal: getEstado(), mensaje: 'Primer mensaje eliminado.' });
});

app.post('/api/clientes/shift', (req, res) => {
    if (clientes.length === 0) return res.status(400).json({ error: 'No hay clientes en la cola.' });
    const clienteAtendido = clientes.shift();
    res.json({ success: true, extraido: clienteAtendido, estadoGlobal: getEstado(), mensaje: `Atendiendo a: ${clienteAtendido}` });
});

// --- ENDPOINTS DELETE (Para corrección de errores con la "X") ---
app.delete('/api/numeros/:index', (req, res) => {
    numeros.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});

app.delete('/api/mensajes/:index', (req, res) => {
    mensajes.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});

app.delete('/api/clientes/:index', (req, res) => {
    clientes.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Cliente retirado de la fila.' });
});

// --- ESTADO INICIAL ---
app.get('/api/estado', (req, res) => {
    res.json(getEstado());
});

app.listen(PORT, () => console.log(`🚀 Ejercicio 4 activo en http://localhost:${PORT}`));