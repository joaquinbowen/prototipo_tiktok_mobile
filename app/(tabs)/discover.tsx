import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, FlatList,
} from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { TRENDING, VIDEOS } from '@/data/mocks';

const SUGGESTED = [
  { id: 's1', query: 'workout en casa', views: '4.2M' },
  { id: 's2', query: 'ceviche receta', views: '2.8M' },
  { id: 's3', query: 'gaming latam', views: '1.9M' },
  { id: 's4', query: 'baile viral', views: '6.1M' },
];

export default function DiscoverScreen() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, focused && styles.searchBoxFocused]}>
          <Text style={styles.searchIcon}>⊕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Busca videos, usuarios, hashtags..."
            placeholderTextColor={COLORS.muted}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Trending hashtags */}
        <Text style={styles.sectionTitle}>Tendencias ahora</Text>
        <View style={styles.trendingGrid}>
          {TRENDING.map((item, i) => (
            <TouchableOpacity key={item.tag} activeOpacity={0.8}>
              <LinearGradient
                colors={[item.color + 'CC', item.color + '44']}
                style={styles.trendCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.trendTag}>{item.tag}</Text>
                <Text style={styles.trendViews}>{item.views} videos</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Suggested searches */}
        <Text style={styles.sectionTitle}>Búsquedas populares</Text>
        <View style={styles.suggestedList}>
          {SUGGESTED.map(s => (
            <TouchableOpacity key={s.id} style={styles.suggestedRow} activeOpacity={0.7}>
              <View style={styles.searchIconWrap}>
                <Text style={styles.suggestSearchIcon}>⊕</Text>
              </View>
              <View style={styles.suggestedInfo}>
                <Text style={styles.suggestedQuery}>{s.query}</Text>
                <Text style={styles.suggestedViews}>{s.views} vistas</Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick video grid */}
        <Text style={styles.sectionTitle}>Videos populares</Text>
        <View style={styles.videoGrid}>
          {VIDEOS.map(v => (
            <TouchableOpacity key={v.id} style={styles.videoThumb} activeOpacity={0.85}>
              <LinearGradient
                colors={v.gradientColors}
                style={styles.videoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.videoThumbPlay}>▶</Text>
              </LinearGradient>
              <Text style={styles.videoThumbViews}>
                {(v.likes / 1000).toFixed(0)}K ♥
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  searchRow: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchBoxFocused: {
    borderColor: COLORS.primary,
  },
  searchIcon: { fontSize: 18, color: COLORS.muted },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: FONT.size.md,
    color: COLORS.white,
  },
  clearIcon: { fontSize: 14, color: COLORS.muted, padding: 4 },
  content: { paddingBottom: 100 },

  sectionTitle: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  trendCard: {
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minWidth: 150,
  },
  trendTag: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginBottom: 2,
  },
  trendViews: {
    fontSize: FONT.size.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  suggestedList: {
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  suggestedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestSearchIcon: { fontSize: 16, color: COLORS.subtext },
  suggestedInfo: { flex: 1 },
  suggestedQuery: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.medium,
    color: COLORS.white,
  },
  suggestedViews: { fontSize: FONT.size.xs, color: COLORS.muted },
  arrowIcon: { fontSize: 20, color: COLORS.muted },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: 3,
  },
  videoThumb: {
    width: '32.5%',
    aspectRatio: 9 / 16,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  videoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoThumbPlay: { fontSize: 22, color: 'rgba(255,255,255,0.6)' },
  videoThumbViews: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    fontSize: FONT.size.xs,
    color: COLORS.white,
    fontWeight: FONT.weight.semibold,
  },
});
