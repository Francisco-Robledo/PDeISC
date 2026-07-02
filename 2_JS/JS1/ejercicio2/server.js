import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Nuestro Array de base de datos en memoria
let inventario = [];
let idCounter = 1;

app.get('/api/inventario', (req, res) => {
    res.json({ success: true, inventario });
});

app.post('/api/inventario', (req, res) => {
    // 1. Recibimos los 8 campos + el método de guardado
    const { 
        nombre, categoria, precio, stock, 
        estado, marca, sku, fecha, metodoGuardado 
    } = req.body;

    // Validación básica backend
    if (!nombre || !precio) return res.status(400).json({ error: 'Datos incompletos.' });

    // Objeto estructurado
    const nuevoArticulo = {
        id: idCounter++,
        nombre: nombre.trim(),
        categoria,
        precio: Number(precio),
        stock: Number(stock),
        estado,
        marca: marca.trim(),
        sku: sku.trim().toUpperCase(),
        fecha
    };

    // 2. LÓGICA DE LOS DIFERENTES MÉTODOS DE ALMACENAJE EN EL ARRAY
    switch (metodoGuardado) {
        case 'push':
            // Lo manda al final
            inventario.push(nuevoArticulo); 
            break;
        case 'unshift':
            // Lo manda al principio
            inventario.unshift(nuevoArticulo); 
            break;
        case 'splice':
            // Lo inserta exactamente en la mitad del array sin borrar nada
            const mitad = Math.floor(inventario.length / 2);
            inventario.splice(mitad, 0, nuevoArticulo); 
            break;
        default:
            inventario.push(nuevoArticulo);
    }

    res.json({ 
        success: true, 
        inventario, 
        mensaje: `Artículo registrado exitosamente usando ${metodoGuardado}().` 
    });
});

// Endpoint para eliminar (buena práctica UX)
app.delete('/api/inventario/:id', (req, res) => {
    const idBorrar = parseInt(req.params.id);
    inventario = inventario.filter(item => item.id !== idBorrar);
    res.json({ success: true, inventario, mensaje: 'Artículo eliminado.' });
});

app.listen(PORT, () => console.log(`🚀 Proyecto Inventario activo en http://localhost:${PORT}`));