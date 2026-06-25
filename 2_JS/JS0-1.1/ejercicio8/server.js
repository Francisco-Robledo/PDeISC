import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3008; // Puerto 3008

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Arrays base (Sin 'admin' y sin 'verde' para que pruebes primero el estado false)
let roles = ['user', 'editor', 'guest'];
let colores = ['rojo', 'azul', 'amarillo'];
let numeros = [10, 20, 30, 40];

const getEstado = () => ({ roles, colores, numeros });

// --- ENDPOINTS CORE: EL MÉTODO includes() ---

// 1. Comprobar si existe "admin"
app.get('/api/roles/includes', (req, res) => {
    // includes() devuelve true o false
    const existe = roles.includes('admin'); 
    
    if (existe) {
        res.json({ success: true, existe, mensaje: `¡Acceso concedido! El array CONTIENE la palabra 'admin'.` });
    } else {
        res.json({ success: true, existe, mensaje: `Acceso denegado: El array NO contiene 'admin'.` });
    }
});

// 2. Comprobar si existe "verde"
app.get('/api/colores/includes', (req, res) => {
    const existe = colores.includes('verde');
    
    if (existe) {
        res.json({ success: true, existe, mensaje: `¡Positivo! El color 'verde' está en la paleta.` });
    } else {
        res.json({ success: true, existe, mensaje: `Negativo. No hay rastro del color 'verde'.` });
    }
});

// 3. Verificar si un número ya existe ANTES de sumarlo (Validación)
app.post('/api/numeros/agregar', (req, res) => {
    const nuevoNumero = Number(req.body.valor);
    if (isNaN(nuevoNumero)) return res.status(400).json({ error: 'Debe ser un número válido.' });

    // El guardia de seguridad: includes()
    if (numeros.includes(nuevoNumero)) {
        // Si es true, rechazamos la petición
        return res.status(400).json({ error: `El número ${nuevoNumero} YA EXISTE en el array. Ingresá uno distinto.` });
    }

    // Si es false, lo agregamos normalmente
    numeros.push(nuevoNumero);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `¡Número ${nuevoNumero} agregado con éxito!` });
});


// --- ENDPOINTS PARA AGREGAR ROLES Y COLORES (Para que puedas probar el true) ---
app.post('/api/roles', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-Z]+$/.test(valor)) return res.status(400).json({ error: 'Rol inválido.' });
    roles.push(valor.trim().toLowerCase());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Rol '${valor}' agregado.` });
});

app.post('/api/colores', (req, res) => {
    const { valor } = req.body;
    if (!valor || !/^[a-zA-Z]+$/.test(valor)) return res.status(400).json({ error: 'Color inválido.' });
    colores.push(valor.trim().toLowerCase());
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: `Color '${valor}' agregado.` });
});

// --- ENDPOINTS DELETE (Corrección) ---
app.delete('/api/roles/:index', (req, res) => {
    roles.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Rol eliminado.' });
});
app.delete('/api/colores/:index', (req, res) => {
    colores.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Color eliminado.' });
});
app.delete('/api/numeros/:index', (req, res) => {
    numeros.splice(req.params.index, 1);
    res.json({ success: true, estadoGlobal: getEstado(), mensaje: 'Número eliminado.' });
});

app.get('/api/estado', (req, res) => res.json(getEstado()));

app.listen(PORT, () => console.log(`🚀 Ejercicio 8 activo en http://localhost:${PORT}`));