import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Switch,
  ActivityIndicator,
  Modal,
  Alert,
  ScrollView,
  FlatList,
  SectionList,
  Image,
  RefreshControl,
  Platform,
} from 'react-native';

interface DemoProps {
  componentId: string;
}

export const InteractiveDemo: React.FC<DemoProps> = ({ componentId }) => {
  // Estados para distintos demos
  const [inputText, setInputText] = useState('');
  const [switchVal, setSwitchVal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pressCount, setPressCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  switch (componentId) {
    case 'view':
      return (
        <View style={demoStyles.flexRow}>
          <View style={[demoStyles.box, { backgroundColor: '#3B82F6' }]}>
            <Text style={demoStyles.boxText}>Caja 1</Text>
          </View>
          <View style={[demoStyles.box, { backgroundColor: '#10B981' }]}>
            <Text style={demoStyles.boxText}>Caja 2</Text>
          </View>
          <View style={[demoStyles.box, { backgroundColor: '#8B5CF6' }]}>
            <Text style={demoStyles.boxText}>Caja 3</Text>
          </View>
        </View>
      );

    case 'text':
      return (
        <Text style={demoStyles.textDemo}>
          Texto regular con{' '}
          <Text style={{ fontWeight: 'bold', color: '#2563EB' }}>
            anidación en negrita
          </Text>{' '}
          y{' '}
          <Text
            style={{ textDecorationLine: 'underline', color: '#059669' }}
            onPress={() => Alert.alert('Text', '¡Tocaste el texto interactivo!')}>
            texto interactivo subrayado
          </Text>
          .
        </Text>
      );

    case 'image':
      return (
        <View style={demoStyles.centerRow}>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#E2E8F0' }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 13, color: '#64748B', flex: 1, marginLeft: 12 }}>
            Logo nativo cargado por URL con <Text style={demoStyles.codePill}>resizeMode="contain"</Text>
          </Text>
        </View>
      );

    case 'textinput':
      return (
        <View>
          <TextInput
            style={demoStyles.input}
            placeholder="Escribe algo aquí para probar TextInput..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
          />
          <Text style={demoStyles.subHint}>
            Caracteres: {inputText.length} {inputText ? `| Valor: "${inputText}"` : ''}
          </Text>
        </View>
      );

    case 'scrollview':
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 60 }}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <View key={num} style={demoStyles.scrollItem}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Item {num}</Text>
            </View>
          ))}
        </ScrollView>
      );

    case 'stylesheet':
      return (
        <View style={demoStyles.stylesheetBox}>
          <Text style={demoStyles.stylesheetText}>
            Estilizado mediante <Text style={demoStyles.codePill}>StyleSheet.create()</Text>
          </Text>
        </View>
      );

    case 'button':
      return (
        <View style={{ maxWidth: 220 }}>
          <Button
            title="Presionar Button Nativo"
            color="#2563EB"
            onPress={() => Alert.alert('Button', '¡Has pulsado el botón nativo!')}
          />
        </View>
      );

    case 'pressable':
      return (
        <Pressable
          style={({ pressed }) => [
            demoStyles.pressableBtn,
            { backgroundColor: pressed ? '#1D4ED8' : '#3B82F6', transform: [{ scale: pressed ? 0.97 : 1 }] },
          ]}
          onPress={() => setPressCount((c) => c + 1)}>
          {({ pressed }) => (
            <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>
              {pressed ? '¡Manteniendo pulsado!' : `Pressable (Pulsado: ${pressCount})`}
            </Text>
          )}
        </Pressable>
      );

    case 'touchableopacity':
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          style={demoStyles.touchableBtn}
          onPress={() => Alert.alert('TouchableOpacity', 'Reduce la opacidad al pulsar')}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Toca para ver efecto de opacidad</Text>
        </TouchableOpacity>
      );

    case 'touchablehighlight':
      return (
        <TouchableHighlight
          underlayColor="#FDE047"
          style={demoStyles.touchableHighlightBtn}
          onPress={() => Alert.alert('TouchableHighlight', 'Fondo resaltado en amarillo')}>
          <Text style={{ color: '#1E293B', fontWeight: '600' }}>Presiona y mantén presionado</Text>
        </TouchableHighlight>
      );

    case 'touchablewithoutfeedback':
      return (
        <TouchableWithoutFeedback onPress={() => setPressCount((c) => c + 1)}>
          <View style={demoStyles.withoutFeedbackBox}>
            <Text style={{ color: '#475569', fontSize: 13 }}>
              Toca aquí: no hay cambio visual pero detecta toques ({pressCount})
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );

    case 'switch':
      return (
        <View style={demoStyles.centerRow}>
          <Switch
            value={switchVal}
            onValueChange={setSwitchVal}
            trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
            thumbColor={switchVal ? '#2563EB' : '#FFFFFF'}
          />
          <Text style={{ marginLeft: 12, fontWeight: '600', color: switchVal ? '#2563EB' : '#64748B' }}>
            Estado: {switchVal ? 'ACTIVADO (ON)' : 'DESACTIVADO (OFF)'}
          </Text>
        </View>
      );

    case 'flatlist':
      return (
        <View style={{ height: 100, backgroundColor: '#F8FAFC', borderRadius: 8, padding: 6 }}>
          <FlatList
            data={[
              { id: '1', title: '⚡ Elemento Virtualizado 1' },
              { id: '2', title: '📱 Elemento Virtualizado 2' },
              { id: '3', title: '🚀 Elemento Virtualizado 3' },
              { id: '4', title: '💎 Elemento Virtualizado 4' },
            ]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={demoStyles.flatListItem}>
                <Text style={{ fontSize: 13, color: '#334155' }}>{item.title}</Text>
              </View>
            )}
          />
        </View>
      );

    case 'sectionlist':
      return (
        <View style={{ height: 110, backgroundColor: '#F8FAFC', borderRadius: 8, padding: 6 }}>
          <SectionList
            sections={[
              { title: 'Frutas', data: ['🍎 Manzana', '🍌 Banana'] },
              { title: 'Verduras', data: ['🥕 Zanahoria', '🥦 Brócoli'] },
            ]}
            keyExtractor={(item, index) => item + index}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={demoStyles.sectionHeader}>{title}</Text>
            )}
            renderItem={({ item }) => (
              <Text style={{ fontSize: 12, paddingVertical: 2, paddingHorizontal: 6 }}>{item}</Text>
            )}
          />
        </View>
      );

    case 'activityindicator':
      return (
        <View style={demoStyles.centerRow}>
          <ActivityIndicator size="small" color="#2563EB" animating={loading} />
          <ActivityIndicator size="large" color="#7C3AED" animating={loading} style={{ marginLeft: 16 }} />
          <TouchableOpacity
            style={demoStyles.miniBtn}
            onPress={() => setLoading(!loading)}>
            <Text style={{ fontSize: 12, color: '#2563EB', fontWeight: 'bold' }}>
              {loading ? 'Pausar' : 'Reanudar'}
            </Text>
          </TouchableOpacity>
        </View>
      );

    case 'modal':
      return (
        <View>
          <TouchableOpacity
            style={[demoStyles.touchableBtn, { backgroundColor: '#E11D48' }]}
            onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Abrir Modal Nativo</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={demoStyles.modalOverlay}>
              <View style={demoStyles.modalContent}>
                <Text style={demoStyles.modalTitle}>🪟 Ventana Modal Activa</Text>
                <Text style={demoStyles.modalDesc}>
                  Este es un componente Modal nativo de React Native superpuesto a toda la aplicación.
                </Text>
                <Button title="Cerrar Modal" color="#E11D48" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>
      );

    case 'alert':
      return (
        <TouchableOpacity
          style={[demoStyles.touchableBtn, { backgroundColor: '#DC2626' }]}
          onPress={() =>
            Alert.alert(
              'Alerta Nativa',
              'Este diálogo es invocado con Alert.alert() y utiliza la ventana modal del sistema operativo.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Entendido', onPress: () => console.log('OK Pressed') },
              ]
            )
          }>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>🚨 Disparar Alert.alert()</Text>
        </TouchableOpacity>
      );

    case 'statusbar':
      return (
        <View style={demoStyles.statusBarBox}>
          <Text style={{ fontSize: 13, color: '#0369A1' }}>
            Controla estilo (light/dark) y color de la barra superior del sistema.
          </Text>
        </View>
      );

    case 'safeareaview':
      return (
        <View style={demoStyles.safeAreaBox}>
          <Text style={{ fontSize: 13, color: '#065F46', fontWeight: '600' }}>
            🛡️ Protege contra muescas (notch), islas dinámicas y esquinas redondeadas.
          </Text>
        </View>
      );

    case 'keyboardavoidingview':
      return (
        <View style={demoStyles.inputBox}>
          <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>
            Ajusta la posición para que el teclado no tape el input:
          </Text>
          <TextInput
            placeholder="Campo con comportamiento KeyboardAvoiding..."
            style={[demoStyles.input, { marginBottom: 0 }]}
          />
        </View>
      );

    case 'refreshcontrol':
      return (
        <View style={demoStyles.refreshBox}>
          <ScrollView
            style={{ height: 60 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
            }>
            <Text style={{ fontSize: 12, color: '#1E40AF', textAlign: 'center', paddingTop: 8 }}>
              {refreshing ? '🔄 Actualizando datos...' : '⬇️ Desliza hacia abajo para refrescar (Pull to Refresh)'}
            </Text>
          </ScrollView>
        </View>
      );

    default:
      return null;
  }
};

const demoStyles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    gap: 8,
  },
  box: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  textDemo: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codePill: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#F1F5F9',
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 11,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 6,
  },
  subHint: {
    fontSize: 12,
    color: '#64748B',
  },
  scrollItem: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
  },
  stylesheetBox: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    padding: 12,
    borderRadius: 8,
  },
  stylesheetText: {
    color: '#7E22CE',
    fontSize: 13,
  },
  pressableBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  touchableBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  touchableHighlightBtn: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  withoutFeedbackBox: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  miniBtn: {
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  flatListItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#E2E8F0',
    color: '#1E293B',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
  },
  statusBarBox: {
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0284C7',
  },
  safeAreaBox: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  inputBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  refreshBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
});
