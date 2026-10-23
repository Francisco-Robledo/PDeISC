import React, { useState, useEffect } from 'react';
import { StyleSheet, BackHandler, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScreenName } from './src/types/navigation';
import { HomeScreen } from './src/screens/HomeScreen';
import { CameraScreen } from './src/screens/CameraScreen';
import { BarcodeScannerScreen } from './src/screens/BarcodeScannerScreen';
import { LocationScreen } from './src/screens/LocationScreen';
import { SensorsScreen } from './src/screens/SensorsScreen';
import { BiometricsScreen } from './src/screens/BiometricsScreen';
import { colors } from './src/theme/colors';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');

  useEffect(() => {
    const onBackPress = () => {
      if (currentScreen !== 'home') {
        setCurrentScreen('home');
        return true; // Previene el cierre de la app en Android
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'camera':
        return <CameraScreen onBack={() => setCurrentScreen('home')} />;
      case 'barcode':
        return <BarcodeScannerScreen onBack={() => setCurrentScreen('home')} />;
      case 'location':
        return <LocationScreen onBack={() => setCurrentScreen('home')} />;
      case 'sensors':
        return <SensorsScreen onBack={() => setCurrentScreen('home')} />;
      case 'biometrics':
        return <BiometricsScreen onBack={() => setCurrentScreen('home')} />;
      case 'home':
      default:
        return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.content}>{renderScreen()}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
