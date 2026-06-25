import http from 'http';
import fs from 'fs';
import { obtenerMenu } from './modulos/menu.js';

http.createServer((req, res) => {

    // SCRIPT JS (Corregido a la carpeta 'paginas')
    if (req.url === '/script.js') {
        fs.readFile('paginas/script.js', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Archivo no encontrado');
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/javascript'
            });

            res.end(data);
        });

        return;
    }

    // CSS (Corregido a la carpeta 'paginas')
    if (req.url === '/styles.css') {
        fs.readFile('paginas/styles.css', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Archivo no encontrado');
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/css'
            });

            res.end(data);
        });

        return;
    }

    // RUTAS
    let archivo = '';

    switch (req.url) {
        case '/':
            archivo = 'paginas/home.html';
            break;

        case '/contacto':
            archivo = 'paginas/contacto.html';
            break;

        case '/servicios':
            archivo = 'paginas/servicios.html';
            break;

        case '/about':
            archivo = 'paginas/about.html';
            break;

        case '/ayuda':
            archivo = 'paginas/ayuda.html';
            break;

        default:
            archivo = 'paginas/home.html';
    }

    fs.readFile(archivo, (err, data) => {

        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Error al leer archivo');
            return;
        }

        let contenido = data.toString();

        // MODIFICACIÓN AQUÍ: Usamos una expresión regular para detectar cualquier tipo de etiqueta <body>
        contenido = contenido.replace(/<body[^>]*>/i, (match) => {
            return `${match}${obtenerMenu()}`;
        });

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(contenido);
    });

}).listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});