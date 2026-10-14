import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          <Ionicons name="search-outline" size={18} color={COLORS.muted} style={{ marginRight: 6 }} />
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
              <Ionicons name="close-circle" size={16} color={COLORS.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Trending hashtags */}
        <Text style={styles.sectionTitle}>Tendencias ahora</Text>
        <View style={styles.trendingGrid}>
          {TRENDING.map(item => (
            <TouchableOpacity key={item.tag} activeOpacity={0.8} style={styles.trendCard}>
              <View style={styles.trendCardInner}>
                <Ionicons name="trending-up" size={16} color={item.color} />
                <View>
                  <Text style={styles.trendTag}>{item.tag}</Text>
                  <Text style={styles.trendViews}>{item.views} videos</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Suggested searches */}
        <Text style={styles.sectionTitle}>Búsquedas populares</Text>
        <View style={styles.suggestedList}>
          {SUGGESTED.map(s => (
            <TouchableOpacity key={s.id} style={styles.suggestedRow} activeOpacity={0.7}>
              <View style={styles.searchIconWrap}>
                <Ionicons name="search" size={14} color={COLORS.muted} />
              </View>
              <View style={styles.suggestedInfo}>
                <Text style={styles.suggestedQuery}>{s.query}</Text>
                <Text style={styles.suggestedViews}>{s.views} vistas</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick video grid */}
        <Text style={styles.sectionTitle}>Videos populares</Text>
        <View style={styles.videoGrid}>
          {VIDEOS.map(v => (
            <TouchableOpacity key={v.id} style={styles.videoThumb} activeOpacity={0.85}>
              <View style={[styles.videoGradient, { backgroundColor: v.gradientColors[0] + 'AA' }]}>
                <Ionicons name="play" size={18} color="rgba(255,255,255,0.7)" />
              </View>
              <View style={styles.videoThumbMeta}>
                <Ionicons name="heart" size={10} color={COLORS.white} style={{ marginRight: 2 }} />
                <Text style={styles.videoThumbViews}>
                  {(v.likes / 1000).toFixed(0)}K
                </Text>
              </View>
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
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  searchBoxFocused: {
    borderColor: 'rgba(255,255,255,0.25)',
  },
  searchInput: {
    flex: 1,
    fontSize: FONT.size.sm,
    color: COLORS.white,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: FONT.weight.semibold,
    color: COLORS.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  trendCard: {
    width: '48.5%',
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  trendCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trendTag: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  trendViews: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    marginTop: 2,
  },

  suggestedList: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  suggestedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: SPACING.md,
  },
  searchIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestedInfo: { flex: 1 },
  suggestedQuery: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    color: COLORS.white,
  },
  suggestedViews: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    marginTop: 1,
  },

  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  videoThumb: {
    width: '31.5%',
    height: 140,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  videoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoThumbMeta: {
    position: 'absolute',
    bottom: 4, left: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoThumbViews: {
    fontSize: 10,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
});
