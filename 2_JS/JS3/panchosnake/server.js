(async function () {
    // Se usa import() para evitar require y mantener compatibilidad con la consigna.
    const http = await import("node:http");
    const fs = await import("node:fs");
    const path = await import("node:path");

    // Puerto local del servidor. Si PORT existe en el entorno, usa ese valor.
    const PORT = process.env.PORT || 5000;
    const ROOT = __dirname;

    // Tipos MIME para que el navegador interprete bien cada archivo.
    const MIME_TYPES = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
        ".ttf": "font/ttf",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav"
    };

    function sendFile(response, filePath) {
        // Lee el archivo solicitado y lo devuelve con su tipo correcto.
        fs.readFile(filePath, (error, data) => {
            if (error) {
                response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
                response.end("Archivo no encontrado");
                return;
            }

            const extension = path.extname(filePath).toLowerCase();
            response.writeHead(200, {
                "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
                "Cache-Control": "no-store"
            });
            response.end(data);
        });
    }

    const server = http.createServer((request, response) => {
        // Normaliza la ruta pedida; "/" abre index.html.
        const requestUrl = decodeURIComponent((request.url || "/").split("?")[0]);
        const route = requestUrl === "/" ? "/index.html" : requestUrl;
        const filePath = path.resolve(ROOT, `.${route}`);

        // Seguridad basica: impide pedir archivos fuera de la carpeta del proyecto.
        if (!filePath.startsWith(ROOT)) {
            response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Acceso denegado");
            return;
        }

        sendFile(response, filePath);
    });

    server.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
})();
