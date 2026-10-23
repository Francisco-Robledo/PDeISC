# Proyecto 2 - Cliente de Alumnos

## Descripcion

Aplicacion independiente desarrollada con Node.js y Express que consume la API REST del Proyecto 1 mediante `fetch()` desde el navegador.

No accede directamente a MySQL. Toda la informacion se obtiene exclusivamente desde la API REST.

## Objetivos

- Consumir la API REST del Proyecto 1.
- Obtener datos en formato JSON.
- Procesar el JSON con JavaScript.
- Mostrar alumnos en una tabla HTML responsive con Bootstrap.
- Mantener la tabla actualizada sin recargar la pagina luego de editar o borrar.

## Tecnologias

- HTML5 semantico
- CSS3
- JavaScript ES6+
- Node.js
- Express
- Bootstrap
- Fetch API

## Instalacion

```bash
npm install
npm start
```

La aplicacion queda disponible en:

```text
http://localhost:4000
```

## Configuracion

El archivo `.env` contiene:

```text
PORT=4000
API_BASE_URL=http://localhost:3000/api
```

El Proyecto 1 debe estar ejecutandose para que el cliente pueda obtener alumnos.

## Funcionamiento

1. El cliente consulta `/config` para conocer la URL de la API.
2. Luego ejecuta `fetch()` contra `http://localhost:3000/api/alumnos`.
3. Procesa el JSON recibido.
4. Renderiza la tabla con JavaScript.
5. Las acciones de editar y borrar actualizan la tabla sin recargar la pagina.

## Estructura

```text
proyecto-2-cliente/
├── server.js
├── config/
├── controllers/
├── middlewares/
├── public/
├── routes/
├── services/
└── docs/
```

## Manual de usuario

1. Iniciar primero el Proyecto 1.
2. Ejecutar `npm install`.
3. Ejecutar `npm start`.
4. Abrir `http://localhost:4000`.
5. Usar las acciones de la tabla para editar o borrar alumnos desde la API.

## Manual tecnico

El servidor Express entrega archivos estaticos y expone `/config`. El navegador usa modulos ES para separar configuracion de API, renderizado de tabla, tema visual y control principal de la interfaz.

## Capturas de pantalla

Las capturas pueden incorporarse en esta carpeta luego de ejecutar el proyecto localmente.

## Posibles mejoras

- Agregar filtros por nombre o apellido.
- Agregar ordenamiento por columnas.
- Agregar paginacion visual.
- Agregar tests de interfaz.

## Autor

Francisco.
