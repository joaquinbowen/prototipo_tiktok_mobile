import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          <Ionicons name="add" size={14} color={COLORS.white} />
        </View>
      </View>

      {/* Like */}
      <TouchableOpacity style={styles.action} onPress={onLike} activeOpacity={0.75}>
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={34}
          color={isLiked ? COLORS.primary : COLORS.white}
        />
        <Text style={styles.actionCount}>{formatCount(likes)}</Text>
      </TouchableOpacity>

      {/* Comment */}
      <TouchableOpacity
        style={styles.action}
        onPress={() => Alert.alert('Comentarios', 'Los comentarios estarán disponibles en la versión final.')}
        activeOpacity={0.75}
      >
        <Ionicons name="chatbubble-ellipses" size={30} color={COLORS.white} />
        <Text style={styles.actionCount}>{formatCount(comments)}</Text>
      </TouchableOpacity>

      {/* Save */}
      <TouchableOpacity
        style={styles.action}
        onPress={() => Alert.alert('Guardado', '¡Video guardado en tu colección!')}
        activeOpacity={0.75}
      >
        <Ionicons name="bookmark" size={28} color={COLORS.white} />
        <Text style={styles.actionCount}>{formatCount(saves)}</Text>
      </TouchableOpacity>

      {/* Share */}
      <TouchableOpacity
        style={styles.action}
        onPress={() => Alert.alert('Compartir', 'Función de compartir disponible en la versión final.')}
        activeOpacity={0.75}
      >
        <Ionicons name="arrow-redo" size={30} color={COLORS.white} />
        <Text style={styles.actionCount}>{formatCount(shares)}</Text>
      </TouchableOpacity>

      {/* Music disc */}
      <View style={styles.disc}>
        <Ionicons name="musical-notes" size={16} color={COLORS.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 8,
    bottom: 20,
    width: 60,
    alignItems: 'center',
    gap: 12,
    zIndex: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 4,
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
    bottom: -6,
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
  action: {
    alignItems: 'center',
    gap: 2,
  },
  actionCount: {
    fontSize: FONT.size.xs,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  disc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20,20,20,0.9)',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
});
