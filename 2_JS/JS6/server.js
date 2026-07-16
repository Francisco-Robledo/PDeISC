import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import diccionarioGlobal from './config/diccionario.js';
import { inicializarBaseDeDatos } from './database/connection.js';
import gameRoutes from './routes/gameRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PUERTO = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// La API propia utiliza exclusivamente POST.
app.use('/api/game', gameRoutes);
app.use('/api/scores', scoreRoutes);

app.use((error, _request, response, _next) => {
    if (error instanceof SyntaxError && 'body' in error) {
        return response.status(400).json({ ok: false, mensaje: 'El JSON enviado no es válido.' });
    }

    console.error('[API] Error no controlado:', error.message);
    return response.status(500).json({ ok: false, mensaje: 'Ocurrió un error interno. Intentá nuevamente.' });
});

const inicializarServidor = async () => {
    try {
        // La única consulta externa y la preparación de MySQL finalizan antes
        // de abrir el puerto para que la aplicación no quede a medio iniciar.
        await Promise.all([
            diccionarioGlobal.inicializar(),
            inicializarBaseDeDatos()
        ]);

        app.listen(PUERTO, () => {
            console.log(`[Servidor] Ejecutándose en http://localhost:${PUERTO}`);
        });
    } catch (error) {
        console.error('[Servidor] No fue posible inicializar la aplicación:', error.message);
        process.exitCode = 1;
    }
};

inicializarServidor();
