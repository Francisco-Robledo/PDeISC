import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { COMPONENTS_DATA } from './src/data/componentsData';
import { ComponentCategory, ComponentInfo } from './src/types/component';
import { InteractiveDemo } from './src/components/InteractiveDemo';

const CATEGORIES: ComponentCategory[] = [
  'Todos',
  'Estructura & Layout',
  'Interacción & Controles',
  'Listas',
  'Feedback & Superposiciones',
  'Dispositivo & Utilidades',
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCodes, setExpandedCodes] = useState<{ [id: string]: boolean }>({});

  const toggleCode = (id: string) => {
    setExpandedCodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredComponents = useMemo(() => {
    return COMPONENTS_DATA.filter((comp) => {
      const matchesCategory =
        selectedCategory === 'Todos' || comp.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        comp.name.toLowerCase().includes(query) ||
        comp.purpose.toLowerCase().includes(query) ||
        comp.keyProps.some((p) => p.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const renderComponentCard = ({ item }: { item: ComponentInfo }) => {
    const isCodeVisible = !!expandedCodes[item.id];

    return (
      <View style={styles.card}>
        {/* Encabezado de la tarjeta */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.componentIcon}>{item.icon}</Text>
            <View>
              <Text style={styles.componentName}>&lt;{item.name} /&gt;</Text>
              <Text style={styles.componentCategory}>{item.category}</Text>
            </View>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) }]}>
            <Text style={styles.levelBadgeText}>{item.level}</Text>
          </View>
        </View>

        {/* Sección: ¿Para qué se usa? */}
        <View style={styles.purposeBox}>
          <Text style={styles.purposeLabel}>💡 ¿Para qué se usa?</Text>
          <Text style={styles.purposeText}>{item.purpose}</Text>
        </View>

        {/* Descripción técnica complementaria */}
        <Text style={styles.descriptionText}>{item.description}</Text>

        {/* Props Principales */}
        <View style={styles.propsRow}>
          <Text style={styles.propsLabel}>Props clave:</Text>
          <View style={styles.propsList}>
            {item.keyProps.map((prop) => (
              <View key={prop} style={styles.propChip}>
                <Text style={styles.propChipText}>{prop}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Demostración interactiva en vivo */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoLabel}>⚡ Demostración en vivo:</Text>
          <View style={styles.demoContent}>
            <InteractiveDemo componentId={item.id} />
          </View>
        </View>

        {/* Botón para ver u ocultar el código TypeScript */}
        <TouchableOpacity
          style={styles.toggleCodeBtn}
          activeOpacity={0.7}
          onPress={() => toggleCode(item.id)}>
          <Text style={styles.toggleCodeBtnText}>
            {isCodeVisible ? '▲ Ocultar Código TS' : '▼ Ver Código TypeScript'}
          </Text>
        </TouchableOpacity>

        {/* Snippet de código expandible */}
        {isCodeVisible && (
          <View style={styles.codeSnippetContainer}>
            <Text style={styles.codeSnippetText}>{item.codeExample}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.container}>
        {/* Cabecera Principal */}
        <View style={styles.header}>
          <View style={styles.authorBadge}>
            <Text style={styles.authorBadgeText}>RN0 • Martin Estanga - TypeScript</Text>
          </View>
          <Text style={styles.title}>Componentes Nativos</Text>
          <Text style={styles.subtitle}>
            Guía completa interactiva de todos los componentes esenciales de React Native y para qué se usan.
          </Text>

          {/* Barra de Búsqueda */}
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar componente, prop o uso..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filtros de Categorías Horizontales */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(cat) => cat}
            contentContainerStyle={styles.categoryScroll}
            renderItem={({ item: cat }) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat)}>
                  <Text
                    style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* Contador de resultados */}
          <View style={styles.resultsBar}>
            <Text style={styles.resultsText}>
              Mostrando <Text style={styles.resultsBold}>{filteredComponents.length}</Text> de{' '}
              {COMPONENTS_DATA.length} componentes
            </Text>
          </View>
        </View>

        {/* Lista de componentes */}
        <FlatList
          data={filteredComponents}
          keyExtractor={(item) => item.id}
          renderItem={renderComponentCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No se encontraron componentes</Text>
              <Text style={styles.emptySubtitle}>
                Intenta con otro término de búsqueda o selecciona la categoría "Todos".
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

function getLevelColor(level: string) {
  switch (level) {
    case 'Básico':
      return '#DCFCE7';
    case 'Intermedio':
      return '#FEF3C7';
    case 'Avanzado':
      return '#FEE2E2';
    default:
      return '#E2E8F0';
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  authorBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 10,
  },
  authorBadgeText: {
    color: '#4338CA',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearSearchText: {
    fontSize: 14,
    color: '#94A3B8',
    padding: 4,
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  resultsBar: {
    marginTop: 10,
    paddingHorizontal: 2,
  },
  resultsText: {
    fontSize: 13,
    color: '#64748B',
  },
  resultsBold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  componentIcon: {
    fontSize: 28,
  },
  componentName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  componentCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
    marginTop: 2,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  purposeBox: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  purposeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
    marginBottom: 4,
  },
  purposeText: {
    fontSize: 13,
    color: '#166534',
    lineHeight: 20,
  },
  descriptionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  propsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  propsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  propsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  propChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  propChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  demoContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  demoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  demoContent: {
    marginTop: 2,
  },
  toggleCodeBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  toggleCodeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  codeSnippetContainer: {
    marginTop: 10,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 14,
  },
  codeSnippetText: {
    color: '#38BDF8',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
