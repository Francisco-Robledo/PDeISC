import { createServer } from 'node:http';
import { readFile } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

createServer((req, res) => {
    const pathFile = join(__dirname, 'index.html');

    readFile(pathFile, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Error crítico en el servidor de archivos.');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        }
    });
}).listen(3002, '127.0.0.1', () => console.log('Ej 2 en http://127.0.0.1:3002'));