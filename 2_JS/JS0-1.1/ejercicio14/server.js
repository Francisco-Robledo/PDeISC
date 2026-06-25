import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3014;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base (Estado inicial)
let letras = ['A', 'B', 'C', 'D', 'E'];
let numeros = [1, 2, 3, 4, 5];
let textos = ['JavaScript', 'Desarrollo Web']; // Array de strings para el punto 3

const getEstado = () => ({ letras, numeros, textos });

// --- ENDPOINTS CORE: EL MÉTODO reverse() ---

// 1. Invertir array de letras
app.post('/api/letras/reverse', (req, res) => {
    if (letras.length === 0) return res.status(400).json({ error: 'El array está vacío.' });
    
    // Muta el array original invirtiendo el orden
    letras.reverse();
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: '¡Array de letras invertido!' });
});

// 2. Invertir array de números
app.post('/api/numeros/reverse', (req, res) => {
    if (numeros.length === 0) return res.status(400).json({ error: 'El array está vacío.' });
    
    numeros.reverse();
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: '¡Array de números invertido!' });
});

// 3. Convertir string a array y revertirlo
app.post('/api/textos/reverse', (req, res) => {
    if (textos.length === 0) return res.status(400).json({ error: 'No hay textos para invertir.' });
    
    // Iteramos sobre los textos. Por cada texto:
    // 1. split(''): lo convierte en array de letras -> ['J','a','v','a',...]
    // 2. reverse(): invierte ese array
    // 3. join(''): lo vuelve a unir en un string
    textos = textos.map(texto => texto.split('').reverse().join(''));
    
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: '¡Textos invertidos caracter por caracter!' });
});

// --- ENDPOINTS POST (AGREGAR ELEMENTOS) ---
app.post('/api/letras', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-Z]$/.test(valor)) return res.status(400).json({ error: 'Solo se permite una letra.' });
    letras.push(valor.toUpperCase());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Letra agregada.` });
});

app.post('/api/numeros', (req, res) => {
    const num = Number(req.body.valor);
    if (isNaN(num)) return res.status(400).json({ error: 'Debe ser un número válido.' });
    numeros.push(num);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Número agregado.` });
});

app.post('/api/textos', (req, res) => {
    const { valor } = req.body;
    if (!valor || valor.trim().length < 2) return res.status(400).json({ error: 'El texto es muy corto.' });
    textos.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Texto agregado.` });
});

// --- ENDPOINTS DELETE (CORRECCIÓN INDIVIDUAL) ---
app.delete('/api/letras/:index', (req, res) => {
    letras.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Elemento eliminado.' });
});
app.delete('/api/numeros/:index', (req, res) => {
    numeros.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Elemento eliminado.' });
});
app.delete('/api/textos/:index', (req, res) => {
    textos.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Elemento eliminado.' });
});

app.get('/api/estado', (req, res) => res.json(getEstado()));

app.listen(PORT, () => console.log(`🚀 Ejercicio 14 activo en http://localhost:${PORT}`));