import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4005;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const DIR_ALMACEN = path.join(__dirname, 'almacen_servidor');
if (!fs.existsSync(DIR_ALMACEN)) {
    fs.mkdirSync(DIR_ALMACEN);
}

const normalizarNumeroTexto = (valor) => String(valor).trim().replace('.', ',');
const aNumero = (valor) => Number(String(valor).trim().replace(',', '.'));
const extraerDigitos = (valor) => normalizarNumeroTexto(valor).replace('-', '').replace(',', '');
const empiezaYTerminaIgual = (valor) => {
    const digitos = extraerDigitos(valor);
    return digitos.length > 0 && digitos[0] === digitos[digitos.length - 1];
};

const isFactorial = (n) => {
    if (!Number.isInteger(n) || n < 1) return false;

    let i = 1;
    let fact = 1;

    while (fact < n) {
        i++;
        fact *= i;
    }

    return fact === n;
};

const extraerNumeros = (texto) => {
    const regexCorchetes = /\[\s*(-?\d+(?:[,.]\d+)?)\s*\]/g;
    const numeros = [];
    let match;

    while ((match = regexCorchetes.exec(texto)) !== null) {
        const textoNumero = normalizarNumeroTexto(match[1]);
        numeros.push({ texto: textoNumero, valor: aNumero(textoNumero) });
    }

    if (numeros.length > 0) return numeros;

    const fallback = texto.match(/-?\d+(?:[,.]\d+)?/g) || [];
    return fallback.map(numero => {
        const textoNumero = normalizarNumeroTexto(numero);
        return { texto: textoNumero, valor: aNumero(textoNumero) };
    });
};

app.post('/api/procesar-txt', upload.single('archivoTxt'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subio ningun archivo.' });
        }

        const texto = req.file.buffer.toString('utf-8');
        const numerosExtraidos = extraerNumeros(texto);

        if (numerosExtraidos.length === 0) {
            return res.status(400).json({ error: 'No se encontraron numeros validos en el TXT.' });
        }

        const utiles = [];
        const descartados = [];

        numerosExtraidos.forEach(num => {
            if (empiezaYTerminaIgual(num.texto)) {
                utiles.push(num);
            } else {
                descartados.push(num);
            }
        });

        utiles.sort((a, b) => a.valor - b.valor);

        const total = numerosExtraidos.length;
        const porcentajeUtiles = ((utiles.length / total) * 100).toFixed(2);

        const factorialesMap = new Map();
        numerosExtraidos.forEach(num => {
            if (isFactorial(num.valor)) {
                factorialesMap.set(num.valor, num);
            }
        });
        const factorialesUnicos = [...factorialesMap.values()].sort((a, b) => a.valor - b.valor);

        let contenidoTxt = "======================================\n";
        contenidoTxt += "    REPORTE DE FILTRADO DE NUMEROS\n";
        contenidoTxt += "======================================\n\n";
        contenidoTxt += `Total analizados: ${total}\n`;
        contenidoTxt += `Numeros utiles: ${utiles.length}\n`;
        contenidoTxt += `Numeros no utiles: ${descartados.length}\n`;
        contenidoTxt += `Porcentaje de numeros utiles: ${porcentajeUtiles}%\n\n`;

        contenidoTxt += "--- NUMEROS UTILES (orden ascendente) ---\n";
        contenidoTxt += utiles.length > 0 ? `[ ${utiles.map(num => num.texto).join(', ')} ]\n\n` : "Ninguno.\n\n";

        contenidoTxt += "--- NUMEROS NO UTILES ---\n";
        contenidoTxt += descartados.length > 0 ? `[ ${descartados.map(num => num.texto).join(', ')} ]\n\n` : "Ninguno.\n\n";

        contenidoTxt += "--- NUMEROS FACTORIALES ENCONTRADOS ---\n";
        contenidoTxt += factorialesUnicos.length > 0 ? `[ ${factorialesUnicos.map(num => num.texto).join(', ')} ]\n` : "Ninguno.\n";

        const fileName = `Analisis_${Date.now()}.txt`;
        const filePath = path.join(DIR_ALMACEN, fileName);
        fs.writeFileSync(filePath, contenidoTxt, 'utf8');

        res.json({
            success: true,
            stats: {
                total,
                utiles: utiles.length,
                descartados: descartados.length,
                porcentaje: porcentajeUtiles
            },
            arrays: {
                utiles: utiles.map(num => num.texto),
                descartados: descartados.map(num => num.texto),
                factoriales: factorialesUnicos.map(num => num.texto)
            },
            archivoGenerado: { nombre: fileName, contenido: contenidoTxt },
            mensaje: 'Archivo procesado y guardado en servidor exitosamente.'
        });
    } catch (error) {
        console.error('Error al procesar TXT:', error);
        res.status(500).json({ error: 'No se pudo procesar el archivo TXT.' });
    }
});

app.get('/api/historial', (req, res) => {
    fs.readdir(DIR_ALMACEN, (err, files) => {
        if (err) return res.status(500).json({ error: 'Error leyendo el almacen.' });

        const archivosInfo = files.map(file => {
            const stats = fs.statSync(path.join(DIR_ALMACEN, file));
            return {
                nombre: file,
                kb: (stats.size / 1024).toFixed(2),
                fecha: stats.mtime
            };
        }).sort((a, b) => b.fecha - a.fecha);

        res.json({ success: true, archivos: archivosInfo });
    });
});

app.get('/api/descargar/:nombre', (req, res) => {
    const nombreSeguro = path.basename(req.params.nombre);
    const file = path.join(DIR_ALMACEN, nombreSeguro);

    if (fs.existsSync(file)) {
        res.download(file);
    } else {
        res.status(404).send('Archivo no encontrado');
    }
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Proyecto Filtro TXT activo en http://localhost:${PORT}`));
