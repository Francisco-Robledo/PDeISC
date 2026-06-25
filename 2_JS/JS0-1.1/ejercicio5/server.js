import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005; // Puerto 3005

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base (Estado inicial con suficientes elementos para hacer splice)
let letras = ['A', 'B', 'C', 'D', 'E', 'F'];
let nombres = ['Ana', 'Carlos', 'Beatriz'];
let colores = ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Gris'];

const getEstado = () => ({ letras, nombres, colores });

// --- ENDPOINTS CORE: LAS 3 CARAS DE SPLICE() ---

// 1. ELIMINAR: splice(inicio, cantidad)
app.post('/api/letras/splice', (req, res) => {
    // Verificamos que haya elementos en el índice 1 y 2
    if (letras.length <= 1) return res.status(400).json({ error: 'No hay suficientes letras para eliminar desde la posición 1.' });
    
    // splice(índice desde donde arranca, cuántos borra)
    const eliminados = letras.splice(1, 2); 
    
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Se eliminaron: ${eliminados.join(', ')}` });
});

// 2. INSERTAR SIN ELIMINAR: splice(inicio, 0, nuevoElemento)
app.post('/api/nombres/splice', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) return res.status(400).json({ error: 'Nombre inválido.' });
    
    // splice(índice, 0 borrados, elemento a insertar)
    // La "segunda posición" es el índice 1
    nombres.splice(1, 0, valor.trim()); 
    
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡${valor} insertado en la posición 1!` });
});

// 3. REEMPLAZAR: splice(inicio, cantidad, nuevo1, nuevo2)
app.post('/api/colores/splice', (req, res) => {
    const { posicion, nuevo1, nuevo2 } = req.body;
    const pos = parseInt(posicion);

    if (isNaN(pos) || pos < 0 || pos >= colores.length) {
        return res.status(400).json({ error: 'Posición inicial inválida.' });
    }
    if (!nuevo1 || !nuevo2) {
        return res.status(400).json({ error: 'Faltan elementos para reemplazar.' });
    }

    // splice(índice, borra 2, inserta el 1, inserta el 2)
    const reemplazados = colores.splice(pos, 2, nuevo1.trim(), nuevo2.trim());
    
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Reemplazados ${reemplazados.join(' y ')}` });
});


// --- ENDPOINTS AUXILIARES (Para agregar letras normales y poder seguir probando) ---
app.post('/api/letras', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-Z]$/.test(valor)) return res.status(400).json({ error: 'Solo una letra permitida.' });
    letras.push(valor.toUpperCase());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Letra agregada.` });
});

// --- ENDPOINTS DELETE (Corrección de errores individual) ---
app.delete('/api/letras/:index', (req, res) => {
    letras.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});
app.delete('/api/nombres/:index', (req, res) => {
    nombres.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});
app.delete('/api/colores/:index', (req, res) => {
    colores.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Corrección aplicada.' });
});

// ESTADO INICIAL
app.get('/api/estado', (req, res) => res.json(getEstado()));

app.listen(PORT, () => console.log(`🚀 Ejercicio 5 activo en http://localhost:${PORT}`));