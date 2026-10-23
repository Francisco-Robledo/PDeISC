# 📱 Device Tools App (React Native Expo + EAS APK)

Aplicación móvil profesional desarrollada en **React Native** con el ecosistema **Expo**, diseñada para interactuar directamente con las herramientas y sensores de hardware nativos de los dispositivos móviles, y preconfigurada con **Expo EAS Build** para generar un instalador `.apk` independiente para Android.

---

## 🚀 Herramientas y Sensores Implementados

1. **📷 Cámara HD (`expo-camera`)**
   - Captura de fotografías en alta resolución.
   - Alternancia instantánea entre cámara trasera y cámara frontal (selfie).
   - Control de flash / linterna integrado.
   - Modal de previsualización de imágenes capturadas con opciones para descartar o confirmar.

2. **🔍 Lector de Códigos QR y Barras (`expo-camera` / Barcode Scanning)**
   - Escaneo en tiempo real de códigos QR, EAN-13, EAN-8, Code 128, Code 39, UPC y DataMatrix.
   - Retícula de puntería con guía visual y línea de escaneo.
   - Feedback háptico inmediato al detectar y decodificar el código.
   - Modal con el contenido decodificado y función para pausar/reanudar el escáner.

3. **📍 Ubicación y GPS (`expo-location`)**
   - Telemetría satelital en tiempo real: Latitud, Longitud, Altitud, Rumbo (Heading) y Velocidad (km/h).
   - Indicador de precisión en metros (± m).
   - **Geocodificación Inversa:** Conversión automática de coordenadas GPS en dirección postal humana (calle, número, ciudad, región y país).
   - Botón de refresco manual con feedback háptico.

4. **🏎️ Acelerómetro y Giroscopio (`expo-sensors`)**
   - **Acelerómetro:** Medición de fuerza gravitacional y aceleración en 3 ejes (X, Y, Z).
   - **Giroscopio:** Medición de velocidad angular y rotación en rad/s en los 3 ejes.
   - **Nivel de Burbuja Físico (Spirit Level):** Componente interactivo que responde físicamente a la inclinación del móvil en tiempo real, cambiando a color verde y emitiendo vibración háptica al alcanzar la posición perfectamente nivelada.
   - Selector dinámico de frecuencia de muestreo (50ms, 100ms, 250ms, 500ms).

5. **🔐 Biometría y Seguridad (`expo-local-authentication`)**
   - Diagnóstico automático de compatibilidad de hardware (Huella dactilar, Face ID, etc.).
   - Verificación de credenciales biométricas enroladas en el enclave seguro del dispositivo.
   - Disparador interactivo de autenticación biométrica nativa con manejo de fallos y cancelaciones.
   - Registro de auditoría visual con marcas de tiempo de cada intento de acceso.

6. **📳 Respuesta Háptica (`expo-haptics`)**
   - Vibración y feedback táctil refinado en clics, capturas, escaneo de códigos y nivelación.

---

## 🛠️ Estructura del Proyecto

```text
device-tools-app/
├── App.tsx                      # Enrutador principal y controlador de hardware back button
├── app.json                     # Metadatos de la app y permisos Android / iOS
├── eas.json                     # Perfiles de EAS Build (preview configurado para APK)
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración TypeScript
└── src/
    ├── components/
    │   ├── Header.tsx           # Barra superior con navegación y títulos
    │   ├── ToolCard.tsx         # Tarjeta interactiva del dashboard
    │   └── BubbleLevel.tsx      # Nivel de burbuja dinámico para acelerómetro
    ├── screens/
    │   ├── HomeScreen.tsx       # Dashboard central con acceso a todas las herramientas
    │   ├── CameraScreen.tsx     # Visor de cámara y captura de fotos
    │   ├── BarcodeScannerScreen.tsx # Escáner de códigos QR y códigos de barras
    │   ├── LocationScreen.tsx   # Coordenadas GPS y geocodificación inversa
    │   ├── SensorsScreen.tsx    # Telemetría de acelerómetro, giroscopio y nivel
    │   └── BiometricsScreen.tsx # Diagnóstico y autenticación biométrica
    └── theme/
        └── colors.ts            # Paleta de colores dark/cyberpunk moderna
```

---

## 📦 Cómo Generar el archivo `app.apk` con Expo EAS

El proyecto ya incluye el archivo `eas.json` configurado con el perfil `preview` que especifica `"buildType": "apk"`. Esto permite generar un archivo `.apk` instalable directamente en cualquier teléfono Android sin necesidad de publicarlo en Google Play Store.

### Paso 1: Instalar o ejecutar EAS CLI
No necesitas instalar nada globalmente si usas `npx`, pero si lo prefieres puedes instalarlo:
```bash
npm install -g eas-cli
```

### Paso 2: Iniciar sesión en tu cuenta de Expo
Crea una cuenta gratuita en [expo.dev](https://expo.dev) si aún no tienes una, y ejecuta en la terminal dentro de esta carpeta:
```bash
npx eas-cli login
```
*Ingresa tu usuario / email y contraseña de Expo.*

### Paso 3: Inicializar el proyecto en EAS (solo la primera vez)
```bash
npx eas-cli project:init
```
*Esto vinculará el proyecto con tu cuenta en la nube de Expo y creará el ID de proyecto (`projectId`) en `app.json`.*

### Paso 4: Generar el APK en la nube de EAS
Ejecuta el siguiente comando:
```bash
npx eas-cli build -p android --profile preview
```

### ¿Qué hace este comando?
1. Empaqueta el código y lo envía a los servidores de compilación de Expo EAS.
2. Compila el código nativo de Android con las librerías de Cámara, GPS, Sensores y Biometría.
3. Genera un archivo `.apk` firmado y te proporciona un **enlace directo de descarga** y un **código QR**.
4. Puedes escanear el código QR con tu teléfono o abrir el enlace en tu navegador para descargar el archivo `.apk` e instalarlo en cualquier dispositivo Android.

---

## 💻 Ejecución en Modo Desarrollo Local

Si deseas probar la app antes de compilar el APK:

```bash
# Iniciar el servidor de desarrollo de Expo
npx expo start
```

- Escanea el código QR desde la app **Expo Go** en tu teléfono Android o iOS.
*(Nota: Para ciertas APIs nativas como cámara o biometría en emuladores de PC, se recomienda probar en un dispositivo físico real).*
