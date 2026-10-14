import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING } from '@/constants/layout';
import type { Video } from '@/data/mocks';

const { width, height: defaultHeight } = Dimensions.get('window');

type Props = {
  video: Video;
  isActive: boolean;
  cardHeight?: number;
};

export function VideoCard({ video, isActive, cardHeight }: Props) {
  const currentHeight = cardHeight ?? defaultHeight;

  return (
    <View style={[styles.container, { height: currentHeight }]}>
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
            <Ionicons name="play" size={26} color={COLORS.white} style={{ marginLeft: 3 }} />
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
          <Ionicons name="musical-notes" size={14} color={COLORS.white} />
          <Text style={styles.musicName} numberOfLines={1}>{video.musicName}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    backgroundColor: COLORS.black,
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    ...(StyleSheet.absoluteFill as any),
  },
  playArea: {
    ...(StyleSheet.absoluteFill as any),
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 80,
  },
  playRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    paddingBottom: 24,
    paddingTop: 60,
    gap: SPACING.xs,
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
    paddingVertical: 4,
  },
  followText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    color: COLORS.white,
  },
  description: {
    fontSize: FONT.size.md,
    color: COLORS.white,
    lineHeight: 20,
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
    marginTop: 2,
  },
  musicName: {
    fontSize: FONT.size.sm,
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
  },
});
