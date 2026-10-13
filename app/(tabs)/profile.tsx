import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, FlatList, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { MY_PROFILE, VIDEOS } from '@/data/mocks';

const { width } = Dimensions.get('window');
const GRID_ITEM = (width - SPACING.md * 2 - 4) / 3;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.headerIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerUsername}>{MY_PROFILE.username}</Text>
          <TouchableOpacity>
            <Text style={styles.headerIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar + stats */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarInitial}>
              {MY_PROFILE.name.charAt(0)}
            </Text>
          </LinearGradient>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              { label: 'Siguiendo', value: MY_PROFILE.following.toLocaleString() },
              { label: 'Seguidores', value: (MY_PROFILE.followers / 1000).toFixed(1) + 'K' },
              { label: 'Me Gusta', value: (MY_PROFILE.likes / 1000).toFixed(1) + 'K' },
            ].map(stat => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Name + bio */}
        <View style={styles.bioSection}>
          <Text style={styles.name}>{MY_PROFILE.name}</Text>
          <Text style={styles.bio}>{MY_PROFILE.bio}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>Editar perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push('/creator-studio')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>⚡ Creator Studio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnIcon}>
            <Text style={styles.btnIconText}>⊕</Text>
          </TouchableOpacity>
        </View>

        {/* Video grid */}
        <View style={styles.gridHeader}>
          <TouchableOpacity style={styles.gridTab}>
            <Text style={styles.gridTabIconActive}>⊞</Text>
            <View style={styles.gridTabUnderline} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTab}>
            <Text style={styles.gridTabIcon}>♥</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTab}>
            <Text style={styles.gridTabIcon}>🔒</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.videoGrid}>
          {[...VIDEOS, ...VIDEOS.slice(0, 4)].map((v, i) => (
            <TouchableOpacity key={`${v.id}-${i}`} style={styles.videoThumb} activeOpacity={0.85}>
              <LinearGradient
                colors={v.gradientColors}
                style={styles.videoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.videoPlay}>▶</Text>
              </LinearGradient>
              <View style={styles.videoMeta}>
                <Text style={styles.videoViews}>♥ {(v.likes / 1000).toFixed(0)}K</Text>
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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  headerIcon: { fontSize: 28, color: COLORS.white, lineHeight: 32, padding: 4 },
  headerUsername: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },

  profileSection: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 36, fontWeight: FONT.weight.black, color: COLORS.white },

  statsRow: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: FONT.size.xl, fontWeight: FONT.weight.black, color: COLORS.white },
  statLabel: { fontSize: FONT.size.xs, color: COLORS.subtext, marginTop: 2 },

  bioSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  name: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },
  bio: { fontSize: FONT.size.sm, color: COLORS.subtext, textAlign: 'center', lineHeight: 19 },

  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  btnSecondaryText: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.white },
  btnPrimary: {
    flex: 1.4,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  btnPrimaryText: { fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.white },
  btnIcon: {
    width: 40,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  btnIconText: { fontSize: 18, color: COLORS.white },

  gridHeader: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  gridTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    position: 'relative',
  },
  gridTabIconActive: { fontSize: 22, color: COLORS.white },
  gridTabIcon: { fontSize: 22, color: COLORS.muted },
  gridTabUnderline: {
    position: 'absolute',
    bottom: 0, left: '20%', right: '20%',
    height: 2,
    backgroundColor: COLORS.white,
  },

  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    padding: 1,
  },
  videoThumb: {
    width: GRID_ITEM,
    height: GRID_ITEM * 1.4,
    overflow: 'hidden',
    position: 'relative',
  },
  videoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlay: { fontSize: 20, color: 'rgba(255,255,255,0.5)' },
  videoMeta: {
    position: 'absolute',
    bottom: 4, left: 4,
  },
  videoViews: { fontSize: FONT.size.xs, color: COLORS.white, fontWeight: FONT.weight.semibold },
});
