import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING } from '@/constants/layout';
import type { Video } from '@/data/mocks';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height;

type Props = {
  video: Video;
  isActive: boolean;
};

export function VideoCard({ video, isActive }: Props) {
  return (
    <View style={styles.container}>
      {/* Simulated video background */}
      <LinearGradient
        colors={[video.gradientColors[0] + '99', video.gradientColors[1] + 'CC', '#000000']}
        style={styles.gradient}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Play indicator (center) */}
      {isActive && (
        <View style={styles.playArea} pointerEvents="none">
          <View style={styles.playRing}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      )}

      {/* Bottom overlay — author info */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.bottomOverlay}
        pointerEvents="none"
      >
        {/* Author */}
        <View style={styles.authorRow}>
          <View style={[styles.avatar, { backgroundColor: video.avatar }]}>
            <Text style={styles.avatarInitial}>
              {video.author.charAt(0)}
            </Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.username}>{video.username}</Text>
            <Text style={styles.authorName}>{video.author}</Text>
          </View>
          <View style={styles.followBtn}>
            <Text style={styles.followText}>Seguir</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {video.description}
        </Text>

        {/* Hashtags */}
        <View style={styles.hashtagRow}>
          {video.hashtags.slice(0, 3).map(tag => (
            <Text key={tag} style={styles.hashtag}>{tag}</Text>
          ))}
        </View>

        {/* Music */}
        <View style={styles.musicRow}>
          <Text style={styles.musicNote}>♪</Text>
          <Text style={styles.musicName} numberOfLines={1}>{video.musicName}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.black,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  playArea: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 200,
  },
  playRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  playIcon: {
    fontSize: 28,
    color: COLORS.white,
    marginLeft: 4,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    paddingBottom: 80, // above tab bar
    paddingTop: 60,
    gap: SPACING.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  avatarInitial: {
    fontSize: 17,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  authorInfo: {
    flex: 1,
  },
  username: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  authorName: {
    fontSize: FONT.size.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  followBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.white,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  followText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    color: COLORS.white,
  },
  description: {
    fontSize: FONT.size.md,
    color: COLORS.white,
    lineHeight: 21,
  },
  hashtagRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  hashtag: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    color: COLORS.white,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  musicNote: {
    fontSize: FONT.size.md,
    color: COLORS.white,
  },
  musicName: {
    fontSize: FONT.size.sm,
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
  },
});
