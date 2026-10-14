import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from '@/components/LinearGradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { MY_PROFILE, VIDEOS } from '@/data/mocks';
import { useMonetization } from '@/context/MonetizationContext';

const { width } = Dimensions.get('window');
// Full edge-to-edge 3-column calculation with 1px gap
const GRID_ITEM_WIDTH = Math.floor((width - 2) / 3);
const GRID_ITEM_HEIGHT = Math.floor(GRID_ITEM_WIDTH * 1.35);

export default function ProfileScreen() {
  const { isPaid, balance } = useMonetization();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={26} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.usernameWrap}>
            <Text style={styles.headerUsername}>{MY_PROFILE.username}</Text>
            {isPaid && (
              <Ionicons name="checkmark-circle" size={16} color={COLORS.gold} style={{ marginLeft: 4 }} />
            )}
          </View>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="ellipsis-horizontal" size={22} color={COLORS.white} />
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
          <View style={styles.nameRow}>
            <Text style={styles.name}>{MY_PROFILE.name}</Text>
            {isPaid && (
              <View style={styles.badgeMonetized}>
                <Text style={styles.badgeText}>⭐ CREADOR PRO</Text>
              </View>
            )}
          </View>
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
            <Ionicons name="flash" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
            <Text style={styles.btnPrimaryText}>Creator Studio</Text>
          </TouchableOpacity>
          {isPaid && (
            <TouchableOpacity
              style={styles.btnWallet}
              onPress={() => router.push('/wallet')}
              activeOpacity={0.85}
            >
              <Ionicons name="wallet-outline" size={16} color={COLORS.gold} style={{ marginRight: 4 }} />
              <Text style={styles.btnWalletText}>${balance.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Video grid header */}
        <View style={styles.gridHeader}>
          <TouchableOpacity style={styles.gridTab}>
            <Ionicons name="grid" size={20} color={COLORS.white} />
            <View style={styles.gridTabUnderline} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTab}>
            <Ionicons name="heart-outline" size={22} color={COLORS.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTab}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        {/* Video grid - 100% full width edge-to-edge */}
        <View style={styles.videoGrid}>
          {[...VIDEOS, ...VIDEOS.slice(0, 4)].map((v, i) => (
            <TouchableOpacity key={`${v.id}-${i}`} style={styles.videoThumb} activeOpacity={0.85}>
              <LinearGradient
                colors={v.gradientColors}
                style={styles.videoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="play" size={22} color="rgba(255,255,255,0.6)" />
              </LinearGradient>
              <View style={styles.videoMeta}>
                <Ionicons name="heart" size={11} color={COLORS.white} style={{ marginRight: 2 }} />
                <Text style={styles.videoViews}>{(v.likes / 1000).toFixed(0)}K</Text>
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
  headerBtn: { padding: 4 },
  usernameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerUsername: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },

  profileSection: {
    alignItems: 'center',
    paddingTop: SPACING.md,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },
  badgeMonetized: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderColor: 'rgba(255,215,0,0.4)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FONT.weight.bold,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
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
    flex: 1.3,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: { fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.white },
  btnWallet: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: '#1C1605',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWalletText: { fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.gold },

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
    paddingVertical: 10,
    position: 'relative',
  },
  gridTabUnderline: {
    position: 'absolute',
    bottom: 0, left: '25%', right: '25%',
    height: 2,
    backgroundColor: COLORS.white,
  },

  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  videoThumb: {
    width: GRID_ITEM_WIDTH,
    height: GRID_ITEM_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  videoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoMeta: {
    position: 'absolute',
    bottom: 4, left: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoViews: { fontSize: FONT.size.xs, color: COLORS.white, fontWeight: FONT.weight.semibold },
});
