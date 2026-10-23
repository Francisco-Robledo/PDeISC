# El Ahorcado

Juego web de El Ahorcado desarrollado con Node.js, Express, MySQL, HTML, CSS, JavaScript Vanilla y Bootstrap 5.

## Características

- Palabras obtenidas una única vez desde una API pública al iniciar el servidor y guardadas en memoria.
- Teclado virtual, dibujo del ahorcado, vidas, contador de tiempo y puntaje.
- Modal de resultado y guardado de puntaje al ganar.
- Tabla de posiciones con los 10 mejores jugadores.
- Exportación del resultado actual a PDF con jsPDF.
- Interfaz responsive, modo oscuro persistente y botón para volver arriba.
- API propia basada exclusivamente en solicitudes `POST`.

## Requisitos

- Node.js 18 o superior.
- MySQL en ejecución.

## Instalación

1. Abrí una terminal en la carpeta del proyecto.
2. Instalá las dependencias:

   ```bash
   npm install
   ```

3. Configurá las credenciales de MySQL en el archivo `.env`:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=Score
   ```

4. Iniciá la aplicación:

   ```bash
   npm start
   ```

5. Visitá `http://localhost:3000` en el navegador.

Al iniciar, la aplicación crea automáticamente la base de datos `Score` y la tabla `score`. También se puede ejecutar manualmente el script `database/schema.sql`.

## API

Todas las rutas propias usan `POST` y reciben/envían JSON.

| Ruta | Uso |
| --- | --- |
| `/api/game/word` | Obtiene una palabra aleatoria almacenada en memoria. |
| `/api/scores` | Guarda un puntaje ganador: `nombre`, `puntos`, `tiempo`. |
| `/api/scores/top` | Devuelve los 10 mejores puntajes. |

## Estructura

```text
config/       Diccionario y configuración de palabras
controllers/  Lógica de las solicitudes HTTP
database/     Conexión MySQL y esquema SQL
models/       Acceso a la tabla score
routes/       Rutas de la API
public/       Interfaz HTML, CSS y JavaScript
server.js     Inicio de Express y de los servicios
```

## Seguridad y validaciones

- Nombre, tiempo y puntos se validan en frontend y backend.
- Las consultas MySQL usan parámetros preparados.
- El contenido recibido se inserta en la interfaz mediante nodos DOM y `textContent`.
- No se usan eventos JavaScript inline, CSS inline, `alert`, `confirm` ni `prompt`.
