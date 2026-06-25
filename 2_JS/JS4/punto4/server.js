// Importamos módulos nativos usando 'import' (ES Modules)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración necesaria para obtener la ruta actual al usar ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3004;

const server = http.createServer((req, res) => {
    // Ruta GET para obtener los alumnos
    if (req.method === 'GET' && req.url === '/api/alumnos') {
        const rutaJson = path.join(__dirname, 'alumnos.json');
        
        // Leemos el archivo JSON
        fs.readFile(rutaJson, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al leer la base de datos' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data); // Devolvemos el JSON tal cual
        });
    } else {
        // Servidor de archivos estáticos para la carpeta "public"
        let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        const extname = path.extname(filePath);
        
        // Mapeamos extensiones a tipos MIME
        let contentType = 'text/html';
        switch (extname) {
            case '.js': contentType = 'text/javascript'; break;
            case '.css': contentType = 'text/css'; break;
        }

        // Leemos y servimos el archivo estático solicitado
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('Archivo no encontrado');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf8');
            }
        });
    }
});

// Iniciamos el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});