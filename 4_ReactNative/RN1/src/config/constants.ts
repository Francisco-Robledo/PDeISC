// src/config/constants.ts
import { Platform } from 'react-native';

// IP detectada de la máquina local del usuario
export const LOCAL_IP = '192.168.100.27';

// URLs según el entorno de ejecución
// En navegador web se puede usar localhost
// En emulador Android se usa 10.0.2.2
// En teléfono físico (Expo Go) se debe usar la IP de la red local
export const getApiUrlPorDefecto = (): string => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api/login';
  } else if (Platform.OS === 'android') {
    // Si corre en emulador Android o Expo Go físico
    return `http://${LOCAL_IP}:3000/api/login`;
  } else {
    // iOS o Expo Go
    return `http://${LOCAL_IP}:3000/api/login`;
  }
};

// URL para servidor PHP en XAMPP (por si se usa login.php en Apache)
export const PHP_XAMPP_URL = `http://${LOCAL_IP}/rn1/backend/php/login.php`;
