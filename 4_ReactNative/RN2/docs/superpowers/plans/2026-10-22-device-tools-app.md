# Device Tools App (React Native Expo + EAS Build APK) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, production-ready React Native Expo application showcasing mobile device hardware capabilities (Camera, Barcode/QR Scanner, Location & GPS, Accelerometer & Gyroscope sensors, and Biometric Authentication with Haptics) in an interactive dashboard, fully configured with EAS Build to generate a standalone Android `.apk`.

**Architecture:** A modular React Native architecture with Expo SDK. A root navigation controller switches cleanly between a modern Dashboard home view and 5 dedicated hardware screens (`CameraScreen`, `BarcodeScannerScreen`, `LocationScreen`, `SensorsScreen`, `BiometricsScreen`). Each screen manages its permissions, real-time sensor streams, error states, and tactile haptic feedback. A comprehensive `eas.json` and `app.json` configure Android permissions and build profiles for APK generation.

**Tech Stack:**
- React Native 0.76+ / Expo SDK 52+
- TypeScript
- `expo-camera` (Camera photos & modern `CameraView` barcode/QR scanning)
- `expo-location` (GPS coordinates, altitude, accuracy, reverse geocoding)
- `expo-sensors` (Accelerometer & Gyroscope real-time hardware listeners)
- `expo-local-authentication` (Biometrics: Fingerprint, Face ID, Device PIN)
- `expo-haptics` (Tactile feedback)
- `@expo/vector-icons` (Ionicons for intuitive hardware icons)
- EAS CLI & `eas.json` (Preview profile with `buildType: "apk"`)

**Spec:** User request for an interactive device tools application supporting Camera, Barcode Scanner, GPS/Location, Accelerometer & Gyroscope, Biometrics, and Haptic feedback, with EAS configuration to build an Android APK.

## Global Constraints
- Target platform: Android (primary for APK) & iOS compatible.
- All hardware interactions must request permissions gracefully with clear rationale and fallback screens if denied.
- Clean TypeScript types without `any` wherever possible.
- Real-time sensor subscriptions must properly unsubscribe on screen unmount to prevent battery drain or memory leaks.
- EAS configuration must specify `buildType: "apk"` under the `preview` profile for direct Android installation without Google Play requirements.

## Review Focus
1. **Camera & Barcode scanner permission denial**: Show clear fallback UI with instructions to grant permission and retry.
2. **GPS disabled or indoor accuracy low**: Gracefully handle location timeouts, high accuracy fallback, and loading spinners.
3. **Devices lacking specific biometric hardware (e.g., emulator or budget devices)**: Display hardware status chips ("Biometría no disponible / no configurada") rather than crashing.
4. **Sensor unmounting**: Ensure `Accelerometer.removeAllListeners()` and `Gyroscope.removeAllListeners()` are called in `useEffect` cleanup.
5. **EAS Build environment**: `app.json` package name (`android.package`) must match standard Android package naming conventions (`com.devicetools.app`).

---

### Task 1: Project Scaffolding & Dependencies Setup
**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `tsconfig.json`
- Create: `eas.json`

**Interfaces:**
- Consumes: Node.js & npm environment.
- Produces: Installed Expo project with all required native dependencies (`expo-camera`, `expo-location`, `expo-sensors`, `expo-local-authentication`, `expo-haptics`, `@expo/vector-icons`).

- [ ] **Step 1: Initialize Expo project in scratch directory**
  Execute `npx create-expo-app@latest . --template blank-typescript` in `C:\Users\franc\.gemini\antigravity\scratch\device-tools-app`.
- [ ] **Step 2: Install required Expo hardware libraries**
  Execute `npx expo install expo-camera expo-location expo-sensors expo-local-authentication expo-haptics @expo/vector-icons react-native-safe-area-context`.
- [ ] **Step 3: Configure `app.json` and Android permissions**
  Set `name: "DeviceToolsApp"`, `slug: "device-tools-app"`, `android.package: "com.anonymous.devicetoolsapp"`, and permissions for `CAMERA`, `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `USE_BIOMETRIC`, `USE_FINGERPRINT`, `VIBRATE`.
- [ ] **Step 4: Configure `eas.json` for APK compilation**
  Set up `preview` profile with `"buildType": "apk"` and development/production profiles.
- [ ] **Step 5: Verify setup with TypeScript check**
  Run `npx tsc --noEmit` and confirm zero configuration errors.

---

### Task 2: Core Theme, Types, and Navigation Shell
**Files:**
- Create: `src/types/navigation.ts`
- Create: `src/theme/colors.ts`
- Create: `src/components/Header.tsx`
- Create: `App.tsx`

**Interfaces:**
- Consumes: Screen components.
- Produces: Navigation state, header with back button, safe-area layout, and common color scheme.

- [ ] **Step 1: Define navigation types and active screen state**
  Define `type ScreenName = 'home' | 'camera' | 'barcode' | 'location' | 'sensors' | 'biometrics'`.
- [ ] **Step 2: Create dark/modern theme colors**
  Create palette with primary accents (emerald, cyan, violet, amber), dark cards, subtle borders, and readable typography.
- [ ] **Step 3: Implement reusable `Header` component**
  Accepts `title: string`, `showBack?: boolean`, `onBack?: () => void`, and triggers light haptic feedback on back tap.
- [ ] **Step 4: Assemble navigation shell in `App.tsx`**
  Maintain active screen in state with smooth transitions, `SafeAreaProvider`, and back button handling.
- [ ] **Step 5: Verify basic navigation structure**
  Verify component renders without syntax or import errors.

---

### Task 3: Interactive Dashboard (Home Screen)
**Files:**
- Create: `src/components/ToolCard.tsx`
- Create: `src/screens/HomeScreen.tsx`

**Interfaces:**
- Consumes: Navigation callback `onNavigate(screen: ScreenName)`.
- Produces: Interactive grid of 5 tool cards with live badges, descriptive subtitles, and haptic touch feedback.

- [ ] **Step 1: Create `ToolCard` component**
  Card with icon container, title, description, badge (e.g., "Hardware", "GPS", "Seguridad"), and chevron arrow.
- [ ] **Step 2: Build `HomeScreen` layout**
  Include header with app logo/status, subtitle explaining the hardware diagnostic tools, and a 2-column or responsive list of tool cards.
- [ ] **Step 3: Integrate Haptic feedback on card selection**
  Call `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)` on card tap before navigating.
- [ ] **Step 4: Verify Dashboard rendering**
  Check that cards trigger navigation to placeholders correctly.

---

### Task 4: Camera & Photo Capture Screen
**Files:**
- Create: `src/screens/CameraScreen.tsx`

**Interfaces:**
- Consumes: `expo-camera`, `expo-haptics`.
- Produces: Camera viewfinder, front/back flip, flash on/off, shutter button with photo preview modal.

- [ ] **Step 1: Camera permissions hook**
  Request camera permission using `useCameraPermissions()`, rendering friendly permission request button if not granted.
- [ ] **Step 2: Viewfinder implementation**
  Render `CameraView` with dynamic facing mode (`'back' | 'front'`) and flash state (`'on' | 'off'`).
- [ ] **Step 3: Capture action & photo preview**
  Implement `takePictureAsync()`, trigger haptic shutter, and display thumbnail/preview modal with "Tomar otra" and "Guardar/Cerrar".
- [ ] **Step 4: Verify camera screen lifecycle**
  Ensure camera unmounts properly when navigating back to home.

---

### Task 5: Barcode & QR Code Scanner Screen
**Files:**
- Create: `src/screens/BarcodeScannerScreen.tsx`

**Interfaces:**
- Consumes: `CameraView` barcode scanner settings, `expo-haptics`.
- Produces: Real-time QR and barcode reader with visual targeting reticle, sound/haptic trigger on scan, and result sheet.

- [ ] **Step 1: Scanner view setup**
  Configure `CameraView` with `barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39"] }}`.
- [ ] **Step 2: Laser / reticle animation overlay**
  Render a stylish scanner frame with targeting corners and scanning indicator.
- [ ] **Step 3: Scanned data handler**
  Trigger `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`, pause scanning, and display modal showing barcode type and data string with "Escanear de nuevo" button.
- [ ] **Step 4: Verify scanner debounce logic**
  Ensure scanning is locked until user acknowledges the result to prevent repeated triggering.

---

### Task 6: Location & GPS Screen
**Files:**
- Create: `src/screens/LocationScreen.tsx`

**Interfaces:**
- Consumes: `expo-location`, `expo-haptics`.
- Produces: Real-time GPS coordinates, altitude, speed, heading, accuracy indicator, and reverse-geocoded human-readable address.

- [ ] **Step 1: Request location permissions**
  Request foreground location permissions with `Location.requestForegroundPermissionsAsync()`.
- [ ] **Step 2: Fetch current high-accuracy position**
  Retrieve `Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })`.
- [ ] **Step 3: Geocodificación inversa (Reverse Geocoding)**
  Query `Location.reverseGeocodeAsync()` to display Street, City, Region, and Postal Code.
- [ ] **Step 4: Real-time GPS watch / refresh button**
  Add "Actualizar Posición" button with loading spinner and coordinate card display (Lat, Lng, Altitud, Precisión en metros).
- [ ] **Step 5: Verify handling when GPS is loading or permission denied**
  Render clear fallback state and retry button.

---

### Task 7: Sensors Screen (Accelerometer & Gyroscope)
**Files:**
- Create: `src/screens/SensorsScreen.tsx`
- Create: `src/components/BubbleLevel.tsx`

**Interfaces:**
- Consumes: `expo-sensors` (`Accelerometer`, `Gyroscope`).
- Produces: Live X, Y, Z telemetry cards, frequency toggle (100ms, 500ms, 1000ms), and an interactive Spirit Level (Burbuja de nivel) that moves dynamically with device tilt.

- [ ] **Step 1: Setup Accelerometer & Gyroscope subscriptions**
  Subscribe to `Accelerometer.addListener` and `Gyroscope.addListener` with update interval control.
- [ ] **Step 2: Spirit Level (Burbuja) component**
  Calculate offset from X and Y axis to move a visual bubble inside a circular target; turns green when centered (< 0.05 tilt).
- [ ] **Step 3: Real-time telemetry cards**
  Display numeric values formatted to 2 decimals with progress bars indicating axis tilt.
- [ ] **Step 4: Proper cleanup on unmount**
  Ensure subscriptions are removed when leaving the screen (`subscription.remove()`).

---

### Task 8: Biometrics Screen (Fingerprint & Face ID)
**Files:**
- Create: `src/screens/BiometricsScreen.tsx`

**Interfaces:**
- Consumes: `expo-local-authentication`, `expo-haptics`.
- Produces: Biometric hardware audit (Hardware present, Enrolled biometrics, Security level), and interactive authentication prompt.

- [ ] **Step 1: Audit biometric capabilities**
  Call `hasHardwareAsync()`, `isEnrolledAsync()`, and `supportedAuthenticationTypesAsync()`.
- [ ] **Step 2: Render hardware diagnostic badges**
  Display visual chips for "Sensor compatible", "Huellas / Rostro registrados", and "Nivel de seguridad".
- [ ] **Step 3: Interactive authentication trigger**
  Button "Probar Autenticación Biométrica" invoking `LocalAuthentication.authenticateAsync({ promptMessage: "Verificación de Identidad" })`.
- [ ] **Step 4: Success & Failure handling with Haptics**
  Provide visual feedback banner (Success checkmark vs Error alert) with corresponding haptic feedback (`Haptics.NotificationFeedbackType.Success` / `Error`).

---

### Task 9: EAS Build Configuration & APK Generation Guide
**Files:**
- Create: `README.md` (Comprehensive APK generation guide with EAS)
- Verify: `eas.json`

**Interfaces:**
- Consumes: Expo CLI & EAS Build.
- Produces: Validated `eas.json` ready for cloud build (`eas build -p android --profile preview`) and complete step-by-step documentation for the user to compile and download their `.apk`.

- [ ] **Step 1: Review and lock `eas.json`**
  Verify `preview` profile has `"buildType": "apk"` and development/production channels.
- [ ] **Step 2: Write comprehensive APK building guide in `README.md`**
  Include instructions for:
  1. `npm install -g eas-cli` or `npx eas-cli`
  2. `npx eas-cli login`
  3. `npx eas-cli project:init`
  4. `npx eas-cli build -p android --profile preview`
  5. How to download the generated `.apk` link to phone or emulator.
- [ ] **Step 3: End-to-end code verification**
  Run TypeScript typechecker and test imports to ensure 100% build readiness.
