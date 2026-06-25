// Importamos los módulos nativos de Node.js usando ES Modules
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuramos las rutas base para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Puerto donde correrá el servidor
const PORT = 3003;

// Diccionario de tipos de archivo permitidos
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
};

// Creamos el servidor
const server = http.createServer((req, res) => {
    // Si la ruta es '/', cargamos el index.html
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, 'public', filePath);

    // Obtenemos la extensión para definir el Content-Type
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Leemos el archivo y lo servimos
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('Archivo no encontrado');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Iniciamos el servidor
server.listen(PORT, () => {
    console.log(`// Servidor listo. Ingresa a http://localhost:${PORT}`);
});