# 💰 Gestor de Gastos Personales (Tema 1)

Proyecto Web completo y funcional desarrollado para cumplir con todos los requerimientos y temas dictados en el primer cuatrimestre: **Node.js, Arrays, Vectores, Clases (Getters y Setters), Vector de Clases, Import / Export, Fetch y Axios, EVENTOS, y Respuestas elaboradas del lado del servidor**.

---

## 🚀 Cómo Iniciar la Aplicación

1. Abrir una terminal en la carpeta del proyecto:
   ```bash
   cd "C:\Users\Usuario\Desktop\tema 1"
   ```
2. Iniciar el servidor Node.js:
   ```bash
   npm start
   ```
   *(o modo desarrollo con reinicio automático)*:
   ```bash
   npm run dev
   ```
3. Abrir el navegador en:
   👉 **`http://localhost:3000`**

---

## 📋 Cuadro de Temas Aplicados

| Tema Requerido | Implementación en el Proyecto | Ubicación en el Código |
| :--- | :--- | :--- |
| **Node.js** | Servidor HTTP con Express, middlewares (CORS, Morgan, JSON parser), enrutamiento modular REST y control de errores. | `server.js`, `routes/`, `controllers/` |
| **Clases: GET y SET** | Clases con atributos privados, getters y setters estrictos con validación de datos y getters computados (`montoFormateado`, `fechaLegible`). | `models/Gasto.js`, `public/js/models/GastoModel.js` |
| **Vector de Clases** | Estructuras dedicadas que administran colecciones (vectores) de instancias de clases tanto en el servidor como en el cliente. | `models/GestorGastos.js`, `public/js/models/VectorGastos.js` |
| **Arrays / Vectores** | Uso intensivo de métodos funcionales e iterativos: `map()`, `filter()`, `reduce()`, `find()`, `findIndex()`, `sort()`, `splice()`, `push()`, `some()`. | `models/GestorGastos.js`, `controllers/resumenController.js`, `public/js/models/VectorGastos.js` |
| **Import / Export** | Uso estándar de módulos ES6 (`"type": "module"`) tanto en el backend de Node.js como en el frontend modular (`<script type="module">`). | Todos los archivos `.js` |
| **Fetch y Axios** | **Ambas** librerías implementadas y diferenciadas: Axios para CRUD de gastos (y en el backend para divisas); Fetch para resumen financiero, presupuesto y eventos. Monitor de red en tiempo real en la UI. | `public/js/services/axiosService.js`, `public/js/services/fetchService.js`, `controllers/resumenController.js` |
| **EVENTOS** | Eventos del DOM (`submit`, `click`, `change`, `input`, `keydown`, `DOMContentLoaded`), Eventos Personalizados (`CustomEvent`), y `EventEmitter` de Node.js en backend. | `public/js/app.js`, `utils/eventos.js` |
| **Respuestas del Servidor** | Todas las rutas retornan JSON estructurados con código de estado HTTP (200, 201, 400, 404, 500), mensaje descriptivo, datos y estampas de tiempo. | `controllers/gastosController.js`, `controllers/resumenController.js` |
| **Diseño Elaborado** | Interfaz moderna estilo Dashboard financiero con Tailwind CSS, Glassmorphism, barra de progreso interactiva, modales, toasts, filtros y badges. | `public/index.html`, `public/css/styles.css`, `public/js/components/ui.js` |

---

## 🛠️ Estructura del Proyecto

```
tema 1/
├── package.json                   # Configuración con "type": "module" y dependencias
├── server.js                      # Servidor Express y configuración global
├── models/
│   ├── Gasto.js                   # Clase Gasto con campos privados, Getters y Setters con validación
│   └── GestorGastos.js            # Clase GestorGastos (Vector de Clases y métodos de Arrays)
├── controllers/
│   ├── gastosController.js        # Controlador CRUD con respuestas estandarizadas del servidor
│   └── resumenController.js       # Estadísticas con reduce/map y conexión externa con Axios
├── routes/
│   ├── gastosRoutes.js            # Enrutador Express para /api/gastos
│   └── resumenRoutes.js           # Enrutador Express para /api/resumen
├── utils/
│   └── eventos.js                 # Node.js EventEmitter para auditoría de transacciones
├── public/
│   ├── index.html                 # Vista principal, Dashboard, Formularios y Modales
│   ├── css/
│   │   └── styles.css             # Estilos personalizados, glassmorphism y fuentes
│   └── js/
│       ├── models/
│       │   ├── GastoModel.js      # Clase cliente con Getters y Setters
│       │   └── VectorGastos.js    # Vector de Clases en memoria del navegador
│       ├── services/
│       │   ├── axiosService.js    # Operaciones CRUD con la biblioteca Axios
│       │   └── fetchService.js    # Resumen, presupuesto y eventos con Fetch API nativa
│       ├── components/
│       │   └── ui.js              # Renderizado de componentes UI y Toasts
│       └── app.js                 # Controlador principal del frontend con todos los EVENTOS
└── README.md                      # Documentación completa del proyecto
```

---

## 💡 Demostración de los Temas en el Código

### 1. Clases con Getters y Setters (`models/Gasto.js`)
```javascript
export class Gasto {
  #id;
  #titulo;
  #monto;

  get monto() {
    return this.#monto;
  }

  set monto(valor) {
    const numero = Number(valor);
    if (isNaN(numero) || numero <= 0) {
      throw new Error('El monto debe ser un número positivo mayor a 0.');
    }
    this.#monto = Math.round(numero * 100) / 100;
  }

  get montoFormateado() {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(this.#monto);
  }
}
```

### 2. Vector de Clases y Métodos de Vectores (`models/GestorGastos.js`)
```javascript
export class GestorGastos {
  #vectorGastos = []; // Vector de instancias de Gasto

  get totalGastos() {
    // Uso de reduce para acumular el total del vector
    return this.#vectorGastos.reduce((total, gasto) => total + gasto.monto, 0);
  }

  filtrarPorCategoria(categoria) {
    // Uso de filter
    return this.#vectorGastos.filter(g => g.categoria === categoria);
  }
}
```

### 3. Fetch y Axios Coexistiendo
- **Axios (`public/js/services/axiosService.js`)**: Realiza las peticiones `POST`, `PUT`, `DELETE` y `GET` de gastos. También utilizado en el backend (`controllers/resumenController.js`) para consultar cotizaciones internacionales.
- **Fetch (`public/js/services/fetchService.js`)**: Realiza las peticiones `GET /api/resumen`, `PUT /api/resumen/presupuesto` y `GET /api/estado`.
- **Monitor en Pantalla**: El panel lateral "Axios & Fetch" detecta e informa cada petición, la biblioteca empleada, el tiempo de respuesta en milisegundos y el código de respuesta devuelto por el servidor.

### 4. Eventos del DOM y Eventos Personalizados
- **`submit`**: Guardar y editar gastos en el formulario modal.
- **`input`**: Búsqueda en tiempo real mientras el usuario escribe, filtrando instantáneamente el Vector de Clases sin recargar la página.
- **`change`**: Cambio de categorías y ordenamientos.
- **`click`**: Botones de acción, eliminación con confirmación, alternancia de pestañas.
- **`keydown`**: Cierre accesible de ventanas modales mediante la tecla `Escape`.
- **`CustomEvent`**: Disparo de eventos `gastoGuardado` y `presupuestoActualizado` escuchados por módulos independientes para actualizar las estadísticas.
- **Node.js `EventEmitter`**: Registro de transacciones y auditoría en el backend.

---

Desarrollado con arquitectura limpia, código comentado y buenas prácticas profesionales.
