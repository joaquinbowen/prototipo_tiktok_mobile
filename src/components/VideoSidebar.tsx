import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING } from '@/constants/layout';

type Props = {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isLiked: boolean;
  onLike: () => void;
  authorAvatarColor: string;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

export function VideoSidebar({
  likes, comments, shares, saves,
  isLiked, onLike, authorAvatarColor,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Author avatar with follow indicator */}
      <View style={styles.avatarWrapper}>
        <View style={[styles.sideAvatar, { backgroundColor: authorAvatarColor }]} />
        <View style={styles.followDot}>
          <Text style={styles.followDotText}>+</Text>
        </View>
      </View>

      {/* Like */}
      <TouchableOpacity style={styles.action} onPress={onLike} activeOpacity={0.7}>
        <Text style={[styles.actionIcon, isLiked && styles.actionIconLiked]}>
          {isLiked ? '♥' : '♡'}
        </Text>
        <Text style={styles.actionCount}>{formatCount(likes)}</Text>
      </TouchableOpacity>

      {/* Comment */}
      <TouchableOpacity
        style={styles.action}
        onPress={() => Alert.alert('Comentarios', 'Los comentarios estarán disponibles en la versión final.')}
        activeOpacity={0.7}
      >
        <Text style={styles.actionIcon}>💬</Text>
        <Text style={styles.actionCount}>{formatCount(comments)}</Text>
      </TouchableOpacity>

      {/* Save */}
      <TouchableOpacity
        style={styles.action}
        onPress={() => Alert.alert('Guardado', '¡Video guardado en tu colección!')}
        activeOpacity={0.7}
      >
        <Text style={styles.actionIcon}>🔖</Text>
        <Text style={styles.actionCount}>{formatCount(saves)}</Text>
      </TouchableOpacity>

      {/* Share */}
      <TouchableOpacity
        style={styles.action}
        onPress={() => Alert.alert('Compartir', 'Función de compartir disponible en la versión final.')}
        activeOpacity={0.7}
      >
        <Text style={styles.actionIcon}>↗</Text>
        <Text style={styles.actionCount}>{formatCount(shares)}</Text>
      </TouchableOpacity>

      {/* Music disc */}
      <View style={styles.disc}>
        <Text style={styles.discNote}>♪</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: SPACING.md,
    bottom: 100,
    alignItems: 'center',
    gap: SPACING.lg,
  },
  avatarWrapper: {
    position: 'relative',
  },
  sideAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  followDot: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  followDotText: {
    fontSize: 12,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    lineHeight: 16,
  },
  action: {
    alignItems: 'center',
    gap: 2,
  },
  actionIcon: {
    fontSize: 30,
    color: COLORS.white,
  },
  actionIconLiked: {
    color: COLORS.primary,
  },
  actionCount: {
    fontSize: FONT.size.xs,
    fontWeight: FONT.weight.semibold,
    color: COLORS.white,
  },
  disc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 3,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discNote: {
    fontSize: 16,
    color: COLORS.white,
  },
});
