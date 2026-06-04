const http = require('http');
const fs = require('fs');
const path = require('path');

// Puerto del juego BOVER
const PORT = 4180;
// Archivo donde se guardará el historial de las partidas
const HISTORY_FILE = path.join(__dirname, 'history.json');

// Diccionario de tipos de archivos (MIME types) para que el navegador los lea correctamente
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf'
};

const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
    const pathname = decodeURIComponent(requestUrl.pathname);

    // --- 1. ENDPOINTS DE LA API (Historial) ---
    
    if (pathname === '/api/history') {
        // GET: Devolver el historial guardado
        if (req.method === 'GET') {
            fs.readFile(HISTORY_FILE, 'utf8', (err, data) => {
                if (err) {
                    // Si el archivo no existe aún, devolvemos un array vacío
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify([]));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
            return;
        }

        // POST: Guardar una nueva partida
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const newMatch = JSON.parse(body);
                    newMatch.date = new Date().toISOString(); // Le agregamos la fecha actual

                    // Leemos el historial existente
                    fs.readFile(HISTORY_FILE, 'utf8', (err, data) => {
                        let history = [];
                        if (!err && data) {
                            history = JSON.parse(data);
                        }
                        
                        // Agregamos la nueva partida al inicio
                        history.unshift(newMatch);
                        
                        // Mantenemos solo las últimas 50 partidas para no saturar el archivo
                        if (history.length > 50) history.pop();

                        // Guardamos el archivo actualizado
                        fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), (err) => {
                            if (err) {
                                res.writeHead(500);
                                res.end(JSON.stringify({ error: 'Error al guardar el historial' }));
                                return;
                            }
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Partida guardada con éxito' }));
                        });
                    });
                } catch (error) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Formato de datos inválido' }));
                }
            });
            return;
        }

        // DELETE: Borrar el historial guardado
        if (req.method === 'DELETE') {
            fs.writeFile(HISTORY_FILE, JSON.stringify([], null, 2), (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Error al borrar el historial' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Historial borrado con exito' }));
            });
            return;
        }
    }

    // --- 2. SERVIDOR DE ARCHIVOS ESTÁTICOS ---
    
    // Si la ruta es '/', servimos el index.html
    let filePath = '.' + pathname;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Obtener la extensión del archivo para saber qué Content-Type devolver
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Leer el archivo solicitado
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Error del servidor: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Iniciar el servidor
server.listen(PORT, '127.0.0.1', () => {
    console.log(`=========================================`);
    console.log(`⚽ BOVER - EL SUPERCLÁSICO ARCADE ⚽`);
    console.log(`=========================================`);
    console.log(`Servidor corriendo en: http://127.0.0.1:${PORT}/`);
    console.log(`=========================================`);
});
