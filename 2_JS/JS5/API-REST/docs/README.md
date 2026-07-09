# Proyecto 1 - API REST de Alumnos

## Descripcion

Aplicacion independiente desarrollada con Node.js, Express y MySQL para crear la base de datos `alumnosDB`, administrar la tabla `alumnos` y exponer los registros mediante una API REST en formato JSON.

Incluye una interfaz web para cargar alumnos sin usar sentencias SQL manuales de insercion.

## Objetivos

- Crear automaticamente la base de datos `alumnosDB`.
- Crear la tabla `alumnos`.
- Cargar alumnos desde una interfaz web.
- Validar datos en cliente y servidor.
- Exponer registros mediante una API REST.
- Mantener una arquitectura modular.

## Tecnologias

- HTML5 semantico
- CSS3
- JavaScript ES6+
- Node.js
- Express
- MySQL
- Bootstrap
- Fetch API

## Instalacion

```bash
npm install
npm start
```

La aplicacion queda disponible en:

```text
http://localhost:3000
```

## Configuracion

El archivo `.env` contiene:

```text
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=alumnosDB
DB_PORT=3306
CLIENT_ORIGIN=http://localhost:4000
```

Si tu MySQL usa clave, completar `DB_PASSWORD`.

## Base de datos

La base se crea automaticamente al iniciar el servidor.

Tabla:

```sql
CREATE TABLE alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL,
  apellido VARCHAR(60) NOT NULL,
  edad INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Endpoints

```text
GET /api/alumnos
GET /api/alumnos/:id
POST /api/alumnos
PUT /api/alumnos/:id
DELETE /api/alumnos/:id
```

Todas las respuestas son JSON.

## Validaciones

- Nombre obligatorio, entre 2 y 60 caracteres, solo letras y espacios.
- Apellido obligatorio, entre 2 y 60 caracteres, solo letras y espacios.
- Edad obligatoria, numerica, entera, entre 3 y 120.
- Sanitizacion en backend.
- Consultas preparadas para prevenir SQL Injection.

## Estructura

```text
proyecto-1-api-rest/
├── server.js
├── config/
├── controllers/
├── database/
├── middlewares/
├── models/
├── public/
├── routes/
├── services/
└── docs/
```

## Manual de usuario

1. Iniciar MySQL.
2. Ejecutar `npm install`.
3. Ejecutar `npm start`.
4. Abrir `http://localhost:3000`.
5. Cargar los alumnos desde el formulario.
6. Revisar, editar o borrar registros desde la tabla.

## Manual tecnico

El servidor inicializa la base de datos en `config/database.js`. Las rutas solo reciben solicitudes y delegan en controladores. Los controladores usan servicios y los servicios usan modelos. El modelo contiene las consultas SQL preparadas.

## Capturas de pantalla

Las capturas pueden incorporarse en esta carpeta luego de ejecutar el proyecto localmente.

## Posibles mejoras

- Agregar edicion y eliminacion de alumnos.
- Agregar paginacion y busqueda.
- Agregar tests automatizados.
- Agregar autenticacion si el sistema crece.

## Autor

Francisco.
