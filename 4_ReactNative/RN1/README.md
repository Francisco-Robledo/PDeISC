# 📱 RN1 - Sistema de Acceso de Usuarios con React Native Expo y TypeScript

Proyecto desarrollado para el acceso de usuarios cumpliendo con todos los requerimientos de navegación por paginación, paso de datos mediante **Props** y consumo de API Backend con base de datos **MySQL** (compatible con XAMPP / WAMP / LAMP).

---

## 📁 Estructura del Proyecto en el Escritorio (`RN1`)

```text
RN1/
├── App.tsx                      # Componente principal: controla la paginación y envía Props
├── src/
│   ├── types/
│   │   └── usuario.ts           # Interfaces TypeScript (Usuario, LoginResponse, TipoPagina)
│   ├── config/
│   │   └── constants.ts         # IP local (192.168.100.27) y endpoints del backend
│   ├── services/
│   │   └── authService.ts       # Servicio que realiza la petición POST con fetch() a la API
│   └── screens/
│       ├── PaginaLogin.tsx      # Formulario de inicio de sesión con validación
│       └── PaginaBienvenida.tsx # Pantalla que recibe los datos del usuario mediante PROPS
├── backend/
│   ├── server.js                # API Backend en Node.js Express con MySQL y fallback educativo
│   ├── package.json             # Dependencias del backend (express, cors, mysql2)
│   ├── database.sql             # Script SQL para importar en phpMyAdmin (XAMPP/WAMP)
│   └── php/
│       ├── db.php               # Conexión PDO a MySQL para Apache en XAMPP
│       └── login.php            # Endpoint API en PHP para XAMPP htdocs
├── iniciar_backend.bat          # Acceso directo para encender el servidor Node.js
├── iniciar_frontend.bat         # Acceso directo para encender Expo
└── README.md                    # Esta guía de uso
```

---

## 🎯 Cumplimiento de los Requerimientos

### 1. Página principal y Paginación
- **`src/screens/PaginaLogin.tsx`**: Muestra el formulario con entradas para correo/usuario y contraseña, visibilidad de clave, indicador de carga y mensajes de error.
- **Paginación en `App.tsx`**: Controlada mediante el estado `paginaActual` (`'login'` | `'bienvenida'`). Si la autenticación es exitosa, cambia de pantalla inmediatamente.

### 2. Paso de Datos mediante Props
- **`src/screens/PaginaBienvenida.tsx`**: Declara explícitamente su interfaz de propiedades:
  ```typescript
  export interface PaginaBienvenidaProps {
    usuario: Usuario;
    onCerrarSesion: () => void;
  }
  ```
- En **`App.tsx`**, los datos recibidos de la API se envían a la pantalla como **Props**:
  ```tsx
  <PaginaBienvenida
    usuario={usuarioActivo}
    onCerrarSesion={handleCerrarSesion}
  />
  ```

### 3. Backend API y Base de Datos MySQL
- Se incluyen **dos implementaciones de API**:
  1. **Node.js Express (`backend/server.js`)**: Lista para ejecutar sin configuraciones adicionales (`npm start`). Se conecta a MySQL en el puerto 3306 e incluye tolerancia por fallback si XAMPP aún no está abierto.
  2. **PHP (`backend/php/login.php`)**: Lista para ser copiada a `htdocs` en XAMPP.
- Base de datos MySQL con script `database.sql` para crear la base `rn1_db` y la tabla `usuarios`.

---

## 🗄️ Paso 1: Configurar la Base de Datos en XAMPP / WAMP

1. Abre el panel de control de **XAMPP** o **WAMP** e inicia el módulo **MySQL** (y **Apache** si usas PHP).
2. Entra a tu navegador a [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Ve a la pestaña **Importar** (o pestaña **SQL**).
4. Selecciona o copia el contenido de `backend/database.sql` y ejecútalo.
5. Se creará la base de datos `rn1_db` con la tabla `usuarios` y los siguientes datos de prueba:

| Nombre | Correo / Usuario | Contraseña | Rol |
| :--- | :--- | :--- | :--- |
| **Francisco Developer** | `admin@correo.com` | `admin123` | Administrador |
| **María González** | `maria@correo.com` | `123456` | Supervisora |
| **Carlos Rodríguez** | `carlos@correo.com` | `clave123` | Estudiante |

---

## 🚀 Paso 2: Iniciar el Backend

### Opción A: Con Node.js (Recomendada y más rápida)
En una terminal:
```bash
cd backend
npm start
```
*(O simplemente haz doble clic en `iniciar_backend.bat`)*

El servidor quedará disponible en:
- Local: `http://localhost:3000/api/login`
- Dispositivos móviles / Red local: `http://192.168.100.27:3000/api/login`

### Opción B: Con PHP en XAMPP
1. Copia la carpeta `backend/php` a tu directorio `htdocs`:
   - Ruta destino: `C:\xampp\htdocs\rn1\`
2. La API estará disponible en: `http://localhost/rn1/login.php` (o con tu IP `http://192.168.100.27/rn1/login.php`).

---

## 📱 Paso 3: Iniciar el Frontend (React Native Expo)

En otra terminal (o haz doble clic en `iniciar_frontend.bat`):
```bash
npx expo start
```

### Opciones para visualizar la aplicación:
1. **Navegador Web**: Presiona la tecla `w` en la consola de Expo o ejecuta `npm run web`.
2. **Celular Físico**: Abre la aplicación **Expo Go** en tu Android o iOS y escanea el código QR que aparece en pantalla (asegúrate de estar conectado a la misma red Wi-Fi).
3. **Emulador Android**: Presiona la tecla `a`.
