import http from 'http';
import fs from 'fs';
import { obtenerMenu } from './modulos/menu.js';

http.createServer((req, res) => {

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
        res.writeHead(200, { 'Content-Type': 'text/html' });

        if (err) {
            res.end('Error al leer archivo');
            return;
        }

        let contenido = obtenerMenu() + data.toString();

        res.end(contenido);
    });

}).listen(3000);

console.log('Servidor en http://localhost:3000');