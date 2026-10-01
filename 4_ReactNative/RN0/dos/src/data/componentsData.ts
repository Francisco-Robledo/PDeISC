import { ComponentInfo } from '../types/component';

export const COMPONENTS_DATA: ComponentInfo[] = [
  // ==========================================
  // 1. ESTRUCTURA & LAYOUT
  // ==========================================
  {
    id: 'view',
    name: 'View',
    category: 'Estructura & Layout',
    purpose:
      'Es el contenedor más fundamental para construir una interfaz gráfica en React Native. Equivale al elemento <div> en HTML. Se utiliza para estructurar pantallas, agrupar otros componentes, aplicar modelos de caja con Flexbox, márgenes, rellenos y bordes.',
    description:
      'Provee soporte para estilos flexbox, control de accesibilidad y captura de eventos táctiles nativos.',
    keyProps: ['style', 'pointerEvents', 'accessible', 'onLayout'],
    codeExample: `<View style={{ flex: 1, padding: 16, backgroundColor: '#E2E8F0', borderRadius: 8 }}>
  <Text>Contenido dentro del View</Text>
</View>`,
    badgeColor: '#3B82F6',
    level: 'Básico',
    icon: '📦',
  },
  {
    id: 'text',
    name: 'Text',
    category: 'Estructura & Layout',
    purpose:
      'Es el componente nativo obligatorio para mostrar texto en pantalla. En React Native, a diferencia de la web, ningún texto puede existir suelto sin estar contenido dentro de una etiqueta <Text>.',
    description:
      'Soporta anidación de estilos (estilos en cascada dentro de textos), eventos de presión al hacer clic y selección de texto por parte del usuario.',
    keyProps: ['numberOfLines', 'ellipsizeMode', 'onPress', 'selectable'],
    codeExample: `<Text style={{ fontSize: 16, color: '#1E293B', fontWeight: 'bold' }}>
  Texto en negrita con <Text style={{ color: '#2563EB' }}>texto anidado azul</Text>
</Text>`,
    badgeColor: '#0EA5E9',
    level: 'Básico',
    icon: '📝',
  },
  {
    id: 'image',
    name: 'Image',
    category: 'Estructura & Layout',
    purpose:
      'Se utiliza para mostrar imágenes estáticas locales (desde los assets del proyecto) o imágenes remotas descargadas de internet mediante una URL.',
    description:
      'Permite controlar el ajuste de aspecto mediante la propiedad resizeMode (cover, contain, stretch, center), aplicar blur y manejar estados de carga y error.',
    keyProps: ['source', 'resizeMode', 'onLoad', 'onError', 'defaultSource'],
    codeExample: `<Image
  source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
  style={{ width: 64, height: 64, borderRadius: 32 }}
  resizeMode="cover"
/>`,
    badgeColor: '#06B6D4',
    level: 'Básico',
    icon: '🖼️',
  },
  {
    id: 'scrollview',
    name: 'ScrollView',
    category: 'Estructura & Layout',
    purpose:
      'Es un contenedor desplazable (scroll) genérico que envuelve múltiples componentes y vistas cuando el contenido excede la altura o el ancho disponible en la pantalla.',
    description:
      'Apto para formularios o pantallas informativas de tamaño moderado. A diferencia de FlatList, renderiza todos sus elementos hijos a la vez, por lo que no se recomienda para listas muy largas.',
    keyProps: [
      'horizontal',
      'showsVerticalScrollIndicator',
      'contentContainerStyle',
      'refreshControl',
    ],
    codeExample: `<ScrollView contentContainerStyle={{ padding: 20 }}>
  <Text>Elemento desplazable 1</Text>
  <Text>Elemento desplazable 2</Text>
</ScrollView>`,
    badgeColor: '#6366F1',
    level: 'Básico',
    icon: '📜',
  },
  {
    id: 'stylesheet',
    name: 'StyleSheet',
    category: 'Estructura & Layout',
    purpose:
      'Es la abstracción nativa para definir hojas de estilo optimizadas, similar a CSS pero usando sintaxis de objetos de JavaScript con camelCase.',
    description:
      'Valida nombres de propiedades en compilación y asigna IDs numéricos a cada estilo en el motor nativo, evitando crear nuevos objetos en cada ciclo de renderizado.',
    keyProps: ['create', 'compose', 'flatten', 'absoluteFillObject'],
    codeExample: `const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
});`,
    badgeColor: '#8B5CF6',
    level: 'Básico',
    icon: '🎨',
  },

  // ==========================================
  // 2. INTERACCIÓN & CONTROLES
  // ==========================================
  {
    id: 'textinput',
    name: 'TextInput',
    category: 'Interacción & Controles',
    purpose:
      'Permite capturar datos ingresados por el usuario mediante el teclado del dispositivo (campos de texto, contraseñas, emails, números, etc.).',
    description:
      'Provee control sobre el tipo de teclado (keyboardType), autocorrección, seguridad para contraseñas (secureTextEntry) y eventos de cambio de texto en tiempo real.',
    keyProps: [
      'value',
      'onChangeText',
      'placeholder',
      'secureTextEntry',
      'keyboardType',
      'multiline',
    ],
    codeExample: `<TextInput
  value={text}
  onChangeText={setText}
  placeholder="Escribe tu nombre..."
  style={{ borderWidth: 1, borderColor: '#CBD5E1', padding: 10, borderRadius: 8 }}
/>`,
    badgeColor: '#10B981',
    level: 'Básico',
    icon: '⌨️',
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Interacción & Controles',
    purpose:
      'Es el componente de botón nativo más básico provisto por React Native. Renderiza un botón simple con el aspecto predeterminado del sistema operativo (en iOS es texto azul sin fondo; en Android es un botón elevado con efecto ripple).',
    description:
      'Fácil de usar y sin configuración previa, pero con opciones limitadas de personalización de estilo.',
    keyProps: ['title', 'onPress', 'color', 'disabled'],
    codeExample: `<Button
  title="Confirmar Acción"
  onPress={() => alert('¡Presionado!')}
  color="#2563EB"
/>`,
    badgeColor: '#059669',
    level: 'Básico',
    icon: '🔘',
  },
  {
    id: 'pressable',
    name: 'Pressable',
    category: 'Interacción & Controles',
    purpose:
      'Es el componente núcleo moderno y recomendado para manejar cualquier interacción táctil. Reemplaza y amplía los antiguos componentes Touchable.',
    description:
      'Permite detectar diferentes etapas de la pulsación (onPressIn, onPressOut, onLongPress) y aplicar estilos o renderizados condicionales basados en el estado booleano { pressed }.',
    keyProps: ['onPress', 'onLongPress', 'style', 'android_ripple', 'hitSlop'],
    codeExample: `<Pressable
  style={({ pressed }) => [
    { backgroundColor: pressed ? '#1D4ED8' : '#2563EB', padding: 12, borderRadius: 8 }
  ]}
  onPress={() => console.log('Tocado')}>
  <Text style={{ color: '#fff', textAlign: 'center' }}>Presionar</Text>
</Pressable>`,
    badgeColor: '#14B8A6',
    level: 'Intermedio',
    icon: '👆',
  },
  {
    id: 'touchableopacity',
    name: 'TouchableOpacity',
    category: 'Interacción & Controles',
    purpose:
      'Envoltorio que responde al toque del usuario reduciendo suavemente la opacidad de los elementos que contiene (activeOpacity). Proporciona retroalimentación visual inmediata.',
    description:
      'Ampliamente utilizado en la comunidad de React Native para crear botones personalizados y elementos accionables con diseño a medida.',
    keyProps: ['onPress', 'activeOpacity', 'disabled', 'hitSlop'],
    codeExample: `<TouchableOpacity
  activeOpacity={0.7}
  onPress={() => console.log('Tocado')}
  style={{ backgroundColor: '#4F46E5', padding: 12, borderRadius: 8 }}>
  <Text style={{ color: '#fff' }}>Botón Opaco</Text>
</TouchableOpacity>`,
    badgeColor: '#6366F1',
    level: 'Básico',
    icon: '✨',
  },
  {
    id: 'touchablehighlight',
    name: 'TouchableHighlight',
    category: 'Interacción & Controles',
    purpose:
      'Envoltorio táctil que resalta el fondo con un color definido (underlayColor) al ser presionado, oscureciendo o tiñendo el botón para indicar interacción.',
    description:
      'Requiere exactamente un único elemento hijo directo (generalmente una View) y suele usarse en listas o botones donde se busca un efecto de tintado al pulsar.',
    keyProps: ['onPress', 'underlayColor', 'activeOpacity', 'onShowUnderlay'],
    codeExample: `<TouchableHighlight
  underlayColor="#FDE047"
  onPress={() => console.log('Highlight')}
  style={{ padding: 12, borderRadius: 8, backgroundColor: '#E2E8F0' }}>
  <Text>Mantén presionado para iluminar</Text>
</TouchableHighlight>`,
    badgeColor: '#F59E0B',
    level: 'Intermedio',
    icon: '💡',
  },
  {
    id: 'touchablewithoutfeedback',
    name: 'TouchableWithoutFeedback',
    category: 'Interacción & Controles',
    purpose:
      'Detecta toques y gestos del usuario SIN aplicar ningún efecto visual ni cambio de estilo al componente hijo.',
    description:
      'Se usa principalmente para cerrar el teclado cuando el usuario toca fuera de un campo de texto, o para cerrar menús desplegables y modales sin alterar visualmente la vista.',
    keyProps: ['onPress', 'onLongPress', 'accessible'],
    codeExample: `<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View style={{ flex: 1 }}>
    <Text>Toca en cualquier parte para cerrar el teclado</Text>
  </View>
</TouchableWithoutFeedback>`,
    badgeColor: '#78716C',
    level: 'Intermedio',
    icon: '👻',
  },
  {
    id: 'switch',
    name: 'Switch',
    category: 'Interacción & Controles',
    purpose:
      'Control de interruptor nativo de dos estados (Toggle On/Off). Se utiliza para opciones booleanas como activar notificaciones, habilitar modo oscuro o aceptar términos.',
    description:
      'Se mapea directamente al UISwitch nativo de iOS y al Switch de Android, con personalización de colores para la pista y el botón.',
    keyProps: ['value', 'onValueChange', 'trackColor', 'thumbColor', 'disabled'],
    codeExample: `<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
  thumbColor={isEnabled ? '#2563EB' : '#94A3B8'}
/>`,
    badgeColor: '#EC4899',
    level: 'Básico',
    icon: '🎚️',
  },

  // ==========================================
  // 3. LISTAS
  // ==========================================
  {
    id: 'flatlist',
    name: 'FlatList',
    category: 'Listas',
    purpose:
      'Es el componente de alto rendimiento para renderizar listas largas o infinitas de elementos. Implementa virtualización: solo mantiene en memoria los elementos visibles en pantalla y los recicla.',
    description:
      'Incluye de forma nativa soporte para encabezados (ListHeaderComponent), pies de página, vista vacía (ListEmptyComponent), separadores y scroll infinito con onEndReached.',
    keyProps: [
      'data',
      'renderItem',
      'keyExtractor',
      'ItemSeparatorComponent',
      'onEndReached',
      'numColumns',
    ],
    codeExample: `<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Text style={{ padding: 12 }}>{item.name}</Text>}
/>`,
    badgeColor: '#8B5CF6',
    level: 'Intermedio',
    icon: '📋',
  },
  {
    id: 'sectionlist',
    name: 'SectionList',
    category: 'Listas',
    purpose:
      'Similar a FlatList pero especializada en listas divididas en secciones categorizadas, cada una con su propio encabezado y pie de sección.',
    description:
      'Ideal para agendas telefónicas agrupadas por letra, listas de transacciones bancarias divididas por mes o cartas de menú por categoría de platos.',
    keyProps: [
      'sections',
      'renderItem',
      'renderSectionHeader',
      'keyExtractor',
      'stickySectionHeadersEnabled',
    ],
    codeExample: `<SectionList
  sections={[
    { title: 'Frutas', data: ['Manzana', 'Banana'] },
    { title: 'Verduras', data: ['Zanahoria', 'Lechuga'] },
  ]}
  keyExtractor={(item, index) => item + index}
  renderSectionHeader={({ section: { title } }) => (
    <Text style={{ fontWeight: 'bold', backgroundColor: '#EEE', padding: 8 }}>{title}</Text>
  )}
  renderItem={({ item }) => <Text style={{ padding: 10 }}>{item}</Text>}
/>`,
    badgeColor: '#A855F7',
    level: 'Intermedio',
    icon: '📑',
  },

  // ==========================================
  // 4. FEEDBACK & SUPERPOSICIONES
  // ==========================================
  {
    id: 'activityindicator',
    name: 'ActivityIndicator',
    category: 'Feedback & Superposiciones',
    purpose:
      'Muestra un indicador circular de actividad (spinner) nativo del sistema operativo para señalar que una tarea asíncrona está en proceso (carga de datos, autenticación, etc.).',
    description:
      'Adapta su estética automáticamente al estilo nativo de iOS o Android. Permite cambiar el tamaño (small, large) y el color del spinner.',
    keyProps: ['animating', 'size', 'color', 'hidesWhenStopped'],
    codeExample: `<ActivityIndicator size="large" color="#2563EB" animating={isLoading} />`,
    badgeColor: '#F59E0B',
    level: 'Básico',
    icon: '⏳',
  },
  {
    id: 'modal',
    name: 'Modal',
    category: 'Feedback & Superposiciones',
    purpose:
      'Permite presentar una pantalla o ventana emergente que se superpone a toda la vista actual de la aplicación.',
    description:
      'Se utiliza para confirmaciones críticas, vistas de detalle, selectores o formularios emergentes. Soporta animaciones nativas (slide, fade, none) y fondo transparente.',
    keyProps: [
      'visible',
      'animationType',
      'transparent',
      'onRequestClose',
      'onShow',
    ],
    codeExample: `<Modal visible={modalVisible} transparent={true} animationType="slide">
  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <View style={{ backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 12 }}>
      <Text>Contenido del Modal</Text>
      <Button title="Cerrar" onPress={() => setModalVisible(false)} />
    </View>
  </View>
</Modal>`,
    badgeColor: '#E11D48',
    level: 'Intermedio',
    icon: '🪟',
  },
  {
    id: 'alert',
    name: 'Alert',
    category: 'Feedback & Superposiciones',
    purpose:
      'Es una API nativa para disparar cuadros de diálogo de alerta del sistema operativo. Muestra un título, un mensaje opcional y una lista de botones de acción.',
    description:
      'A diferencia de los modales creados con JSX, Alert.alert() se invoca de manera imperativa mediante código JavaScript y adopta el diseño del sistema operativo del usuario.',
    keyProps: ['alert(title, message, buttons, options)'],
    codeExample: `Alert.alert(
  'Confirmación',
  '¿Deseas continuar con esta acción?',
  [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Aceptar', onPress: () => console.log('OK') },
  ]
);`,
    badgeColor: '#DC2626',
    level: 'Básico',
    icon: '🚨',
  },
  {
    id: 'statusbar',
    name: 'StatusBar',
    category: 'Feedback & Superposiciones',
    purpose:
      'Controla la apariencia de la barra de estado superior del dispositivo móvil (donde se ubica la hora, el nivel de batería y la señal de red).',
    description:
      'Permite cambiar el color del texto/iconos (light-content o dark-content), el color de fondo en Android y ocultar o mostrar la barra según las necesidades de la pantalla.',
    keyProps: ['barStyle', 'backgroundColor', 'translucent', 'hidden'],
    codeExample: `<StatusBar
  barStyle="dark-content"
  backgroundColor="#F8FAFC"
  translucent={false}
/>`,
    badgeColor: '#0284C7',
    level: 'Básico',
    icon: '📶',
  },

  // ==========================================
  // 5. DISPOSITIVO & UTILIDADES
  // ==========================================
  {
    id: 'safeareaview',
    name: 'SafeAreaView',
    category: 'Dispositivo & Utilidades',
    purpose:
      'Es un contenedor protector que asegura que el contenido de la aplicación no quede oculto ni solapado por las áreas físicas especiales de los dispositivos (el notch, la barra de sensores, esquinas redondeadas o la barra de inicio).',
    description:
      'Aplica automáticamente un margen interno (padding) calculado según las dimensiones seguras del dispositivo.',
    keyProps: ['style', 'children'],
    codeExample: `<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
  <Text>Contenido seguro contra el notch y bordes físicos</Text>
</SafeAreaView>`,
    badgeColor: '#059669',
    level: 'Básico',
    icon: '🛡️',
  },
  {
    id: 'keyboardavoidingview',
    name: 'KeyboardAvoidingView',
    category: 'Dispositivo & Utilidades',
    purpose:
      'Ajusta automáticamente la altura o posición de la pantalla cuando el teclado virtual del dispositivo móvil se abre, impidiendo que el teclado tape los campos de texto (TextInput).',
    description:
      'Soporta diferentes comportamientos según la plataforma (behavior="padding" en iOS, behavior="height" en Android).',
    keyProps: ['behavior', 'keyboardVerticalOffset', 'contentContainerStyle'],
    codeExample: `<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}>
  <TextInput placeholder="Escribe aquí..." />
</KeyboardAvoidingView>`,
    badgeColor: '#D97706',
    level: 'Intermedio',
    icon: '⌨️',
  },
  {
    id: 'refreshcontrol',
    name: 'RefreshControl',
    category: 'Dispositivo & Utilidades',
    purpose:
      'Añade la funcionalidad táctil nativa de "Tirar para refrescar" (Pull to Refresh) dentro de un ScrollView o FlatList.',
    description:
      'Muestra el indicador de recarga mientras el usuario desliza la pantalla hacia abajo y ejecuta una función asíncrona para actualizar los datos.',
    keyProps: ['refreshing', 'onRefresh', 'colors', 'tintColor', 'title'],
    codeExample: `<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      colors={['#2563EB']}
    />
  }>
  <Text>Desliza hacia abajo para actualizar</Text>
</ScrollView>`,
    badgeColor: '#2563EB',
    level: 'Intermedio',
    icon: '🔄',
  },
];
