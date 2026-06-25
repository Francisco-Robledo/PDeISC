import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let frutas = [];
let amigos = ['Marcos']; // Base length: 1
let numeros = [5, 12, 18, 24]; // Base length: 4

// Diccionario de frutas permitidas
// Diccionario de frutas permitidas ampliado
const frutasValidas = ['manzana', 'naranja', 'frutilla', 'banana', 'pera', 'uva', 'kiwi', 'sandia', 'melon', 'durazno', 'ciruela', 'mango', 'papaya', 'limon', 'cereza', 'anana', 'pomelo', 'mandarina', 'pitahaya', 'maracuya', 'arandano', 'frambuesa', 'mora'];
const getEstado = () => ({ frutas, amigos, numeros });

// --- ENDPOINTS POST (AGREGAR) ---

app.post('/api/frutas', (req, res) => {
    if (frutas.length >= 3) return res.status(400).json({ error: 'Ya agregaste las 3 frutas pedidas.' });
    
    const { valor } = req.body;
    const frutaLimpia = valor ? valor.trim().toLowerCase() : '';
    
    if (!frutaLimpia || !frutasValidas.includes(frutaLimpia)) {
        return res.status(400).json({ error: 'Solo se permiten frutas reales.' });
    }
    
    // Capitalizar la primera letra para que quede prolijo
    const frutaFormateada = frutaLimpia.charAt(0).toUpperCase() + frutaLimpia.slice(1);
    frutas.push(frutaFormateada);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡${frutaFormateada} agregada!` });
});

app.post('/api/amigos', (req, res) => {
    if (amigos.length >= 4) return res.status(400).json({ error: 'Ya agregaste tus 3 amigos.' });
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) return res.status(400).json({ error: 'Nombre inválido.' });
    
    amigos.push(valor.trim());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡${valor} agregado!` });
});

app.post('/api/numeros', (req, res) => {
    const nuevoNumero = Number(req.body.valor);
    if (isNaN(nuevoNumero)) return res.status(400).json({ error: 'Debe ser un número.' });

    const ultimoNumero = numeros[numeros.length - 1];
    if (nuevoNumero > ultimoNumero) {
        numeros.push(nuevoNumero);
        res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡${nuevoNumero} aceptado!` });
    } else {
        res.status(400).json({ error: `Rechazado: Debe ser estrictamente mayor a ${ultimoNumero}.` });
    }
});

// --- ENDPOINTS DELETE (BORRAR) ---

app.delete('/api/frutas/:index', (req, res) => {
    frutas.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Fruta eliminada.' });
});

app.delete('/api/amigos/:index', (req, res) => {
    const idx = parseInt(req.params.index);
    if (idx === 0) return res.status(400).json({ error: 'No puedes borrar el amigo base.' });
    amigos.splice(idx, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Amigo eliminado.' });
});

app.delete('/api/numeros/:index', (req, res) => {
    const idx = parseInt(req.params.index);
    if (idx < 4) return res.status(400).json({ error: 'No puedes borrar los números del array original.' });
    numeros.splice(idx, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Número eliminado.' });
});

// --- ENDPOINT GET (ESTADO INICIAL) ---
app.get('/api/estado', (req, res) => {
    res.json(getEstado());
});

app.listen(PORT, () => {
    console.log(`🚀 Ejercicio 1 activo en http://localhost:${PORT}`);
});