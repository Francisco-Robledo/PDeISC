import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4001; // Puerto nuevo para no pisar el proyecto anterior

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Base de datos en memoria
let usuarios = [];
let idCounter = 1;

// GET: Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    res.json({ success: true, usuarios });
});

// POST: Agregar un nuevo usuario sin recargar
app.post('/api/usuarios', (req, res) => {
    const { nombre, rol, metodoLectura } = req.body;

    // Validación estricta en el backend
    if (!nombre || nombre.trim().length < 2) {
        return res.status(400).json({ error: 'Nombre inválido.' });
    }
    if (!rol) {
        return res.status(400).json({ error: 'Debe especificar un rol.' });
    }

    const nuevoUsuario = {
        id: idCounter++,
        nombre: nombre.trim(),
        rol: rol.trim(),
        metodo: metodoLectura,
        fecha: new Date().toLocaleTimeString()
    };

    // Agregamos al principio (unshift) para que el más nuevo salga arriba
    usuarios.unshift(nuevoUsuario);

    res.json({ success: true, usuarios, mensaje: 'Usuario registrado con éxito.' });
});

// DELETE: Para poder borrar usuarios (nuestra regla de buena UX)
app.delete('/api/usuarios/:id', (req, res) => {
    const idBorrar = parseInt(req.params.id);
    usuarios = usuarios.filter(user => user.id !== idBorrar);
    res.json({ success: true, usuarios, mensaje: 'Usuario eliminado.' });
});

app.listen(PORT, () => console.log(`🚀 Proyecto 2 (Formularios) activo en http://localhost:${PORT}`));