import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4004;
const DIR_ALMACEN = path.join(__dirname, 'almacen_servidor');
const NOMBRE_ARCHIVO = 'registro_numeros.txt';
const RUTA_ARCHIVO = path.join(DIR_ALMACEN, NOMBRE_ARCHIVO);
const esNumeroValido = (valor) => /^-?\d+([,.]\d+)?$/.test(String(valor).trim());
const normalizarNumero = (valor) => String(valor).trim().replace('.', ',');

if (!fs.existsSync(DIR_ALMACEN)) {
    fs.mkdirSync(DIR_ALMACEN);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint encargado de generar y guardar el archivo TXT en el servidor
app.post('/api/generar-txt', (req, res) => {
    try {
        const { numeros } = req.body;

        // Validacion estricta en el servidor
        if (!numeros || !Array.isArray(numeros)) {
            return res.status(400).json({ error: 'Formato de datos invalido.' });
        }
        if (numeros.length < 10 || numeros.length > 20) {
            return res.status(400).json({ error: 'La cantidad de numeros debe estar estrictamente entre 10 y 20.' });
        }
        if (!numeros.every(esNumeroValido)) {
            return res.status(400).json({ error: 'Todos los valores deben ser numeros validos. Se permite coma decimal.' });
        }

        const numerosNormalizados = numeros.map(normalizarNumero);

        // Construimos el contenido del archivo TXT con un formato limpio
        let contenidoTxt = "======================================\n";
        contenidoTxt += "    REPORTE DE NUMEROS INGRESADOS\n";
        contenidoTxt += "======================================\n\n";
        contenidoTxt += `Total de registros: ${numeros.length}\n`;
        contenidoTxt += `Fecha de exportacion: ${new Date().toLocaleString('es-AR')}\n\n`;
        contenidoTxt += "Datos:\n";

        numerosNormalizados.forEach((num, index) => {
            contenidoTxt += `  ${String(index + 1).padStart(2, '0')} -> [ ${num} ]\n`;
        });

        contenidoTxt += "\n======================================\n";
        contenidoTxt += "Fin del documento.\n";

        fs.writeFileSync(RUTA_ARCHIVO, contenidoTxt, 'utf8');

        res.json({
            mensaje: 'Archivo TXT generado y guardado en el servidor.',
            nombre: NOMBRE_ARCHIVO,
            contenido: contenidoTxt
        });
    } catch (error) {
        console.error('Error al generar TXT:', error);
        res.status(500).json({ error: 'No se pudo guardar la copia del archivo en el servidor.' });
    }
});

app.get('/api/archivo-txt', (req, res) => {
    if (!fs.existsSync(RUTA_ARCHIVO)) {
        return res.status(404).json({ error: 'Todavia no hay un archivo TXT guardado en el servidor.' });
    }

    res.json({
        nombre: NOMBRE_ARCHIVO,
        contenido: fs.readFileSync(RUTA_ARCHIVO, 'utf8')
    });
});

app.put('/api/archivo-txt', (req, res) => {
    const { contenido } = req.body;

    if (typeof contenido !== 'string') {
        return res.status(400).json({ error: 'El contenido del archivo debe ser texto.' });
    }

    fs.writeFileSync(RUTA_ARCHIVO, contenido, 'utf8');
    res.json({
        mensaje: 'Archivo actualizado en el servidor.',
        nombre: NOMBRE_ARCHIVO,
        contenido
    });
});

app.get('/api/archivo-txt/descargar', (req, res) => {
    if (!fs.existsSync(RUTA_ARCHIVO)) {
        return res.status(404).json({ error: 'Todavia no hay un archivo TXT guardado en el servidor.' });
    }

    res.download(RUTA_ARCHIVO, NOMBRE_ARCHIVO);
});

// Soporte para SPA
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Proyecto TXT activo en http://localhost:${PORT}`));
