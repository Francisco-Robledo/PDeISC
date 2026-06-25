import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3009; // Puerto 3009

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base (Incluyendo un array de objetos para el punto 3)
let nombres = ['Ana', 'Juan', 'Lucía'];
let numeros = [5, 12, 8, 20];
let personas = [
    { nombre: 'Carlos', edad: 28 },
    { nombre: 'Marta', edad: 35 }
];

const getEstado = () => ({ nombres, numeros, personas });

// --- ENDPOINTS CORE: EL MÉTODO forEach() ---

// 1. Saludar a cada nombre
app.get('/api/nombres/saludar', (req, res) => {
    let saludos = [];
    // forEach iterando sobre strings
    nombres.forEach(nombre => {
        saludos.push(`¡Hola, ${nombre}! Bienvenido/a.`);
    });
    res.json({ success: true, resultados: saludos, mensaje: 'Saludos generados con forEach().' });
});

// 2. El doble de cada número
app.get('/api/numeros/doble', (req, res) => {
    let dobles = [];
    // forEach iterando sobre números
    numeros.forEach(num => {
        dobles.push(`El doble de ${num} es ${num * 2}`);
    });
    res.json({ success: true, resultados: dobles, mensaje: 'Cálculos realizados con forEach().' });
});

// 3. Mostrar datos de un objeto
app.get('/api/personas/mostrar', (req, res) => {
    let detalles = [];
    // forEach iterando sobre OBJETOS
    personas.forEach(persona => {
        detalles.push(`👤 Nombre: ${persona.nombre} | 🎂 Edad: ${persona.edad} años`);
    });
    res.json({ success: true, resultados: detalles, mensaje: 'Objetos leídos con forEach().' });
});


// --- ENDPOINTS PARA AGREGAR ELEMENTOS (Interactividad) ---
app.post('/api/nombres', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) return res.status(400).json({ error: 'Nombre inválido.' });
    nombres.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Nombre agregado.` });
});

app.post('/api/numeros', (req, res) => {
    const num = Number(req.body.valor);
    if (isNaN(num)) return res.status(400).json({ error: 'Debe ser numérico.' });
    numeros.push(num);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Número agregado.` });
});

// Endpoint especial para recibir objetos
app.post('/api/personas', (req, res) => {
    const { nombre, edad } = req.body;
    const numEdad = Number(edad);
    if (!nombre || !/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) return res.status(400).json({ error: 'Nombre inválido.' });
    if (isNaN(numEdad) || numEdad <= 0 || numEdad > 120) return res.status(400).json({ error: 'Edad inválida.' });
    
    // Agregamos un objeto literal al array
    personas.push({ nombre: nombre.trim(), edad: numEdad });
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Persona agregada.` });
});

// --- ENDPOINTS DELETE (Para la crucecita 'X') ---
app.delete('/api/nombres/:index', (req, res) => {
    nombres.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});
app.delete('/api/numeros/:index', (req, res) => {
    numeros.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});
app.delete('/api/personas/:index', (req, res) => {
    personas.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Eliminado.' });
});

app.get('/api/estado', (req, res) => res.json(getEstado()));

app.listen(PORT, () => console.log(`🚀 Ejercicio 9 activo en http://localhost:${PORT}`));