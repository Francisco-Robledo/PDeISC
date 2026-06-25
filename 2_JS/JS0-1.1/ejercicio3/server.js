import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003; // Puerto 3003

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base (Estado inicial)
let colores = [];
let tareas = ['Revisar correos', 'Actualizar base de datos']; // Tareas normales base
let usuarios = ['Admin', 'Moderador']; // Usuarios base

const getEstado = () => ({ colores, tareas, usuarios });

// --- ENDPOINTS POST (AGREGAR AL PRINCIPIO CON UNSHIFT) ---

// 1. Colores (Límite de 3)
app.post('/api/colores', (req, res) => {
    if (colores.length >= 3) return res.status(400).json({ error: 'Ya agregaste los 3 colores.' });
    
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) return res.status(400).json({ error: 'Color inválido.' });
    
    // UNSHIFT: Agrega al principio
    colores.unshift(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡Color agregado al principio!` });
});

// 2. Tareas (Agrega como urgente)
app.post('/api/tareas', (req, res) => {
    const { valor } = req.body;
    if (!valor || valor.trim().length < 3) return res.status(400).json({ error: 'Tarea inválida.' });
    
    // Le agregamos un distintivo para que se note que es urgente y usamos UNSHIFT
    const tareaUrgente = `🚨 URGENTE: ${valor.trim()}`;
    tareas.unshift(tareaUrgente);
    
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡Tarea urgente priorizada!` });
});

// 3. Usuarios Conectados
app.post('/api/usuarios', (req, res) => {
    const { valor } = req.body;
    // Solo letras y números, sin espacios (formato de username)
    if (!valor || !/^[a-zA-Z0-9_]+$/.test(valor)) return res.status(400).json({ error: 'Usuario inválido (sin espacios).' });
    
    // UNSHIFT: Conecta al usuario y lo pone primero en la lista
    usuarios.unshift(`@${valor.trim()}`);
    
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡Usuario conectado!` });
});

// --- ENDPOINTS DELETE (Para corrección de errores con la "X") ---
app.delete('/api/colores/:index', (req, res) => {
    colores.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Color eliminado.' });
});

app.delete('/api/tareas/:index', (req, res) => {
    tareas.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Tarea eliminada.' });
});

app.delete('/api/usuarios/:index', (req, res) => {
    usuarios.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Usuario desconectado.' });
});

// --- ENDPOINT ESTADO INICIAL ---
app.get('/api/estado', (req, res) => {
    res.json(getEstado());
});

app.listen(PORT, () => {
    console.log(`🚀 Ejercicio 3 activo en http://localhost:${PORT}`);
});