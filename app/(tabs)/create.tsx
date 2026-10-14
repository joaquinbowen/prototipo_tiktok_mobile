import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';

const DURATIONS = ['15 s', '60 s', '3 min', '10 min'];
const EFFECTS = [
  { id: 'filter', label: 'Filtros', icon: 'color-filter-outline' as const },
  { id: 'music', label: 'Sonidos', icon: 'musical-notes-outline' as const },
  { id: 'effects', label: 'Efectos', icon: 'sparkles-outline' as const },
  { id: 'text', label: 'Texto', icon: 'text-outline' as const },
  { id: 'link', label: 'Enlace', icon: 'link-outline' as const },
];

export default function CreateScreen() {
  const handleAction = (msg: string) =>
    Alert.alert('Cámara Demo', `${msg}\nEsta funcionalidad estará disponible en la versión final.`);

  return (
    <SafeAreaView style={styles.container}>
      {/* Simulated camera viewfinder */}
      <View style={styles.viewfinder}>
        {/* Grid overlay */}
        <View style={styles.gridH1} />
        <View style={styles.gridH2} />
        <View style={styles.gridV1} />
        <View style={styles.gridV2} />

        {/* Center crosshair */}
        <View style={styles.crosshair}>
          <Ionicons name="add" size={32} color="rgba(255,255,255,0.25)" />
        </View>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => handleAction('Flash')} style={styles.topBtn}>
            <Ionicons name="flash-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.viewfinderLabel}>CÁMARA</Text>
          <TouchableOpacity onPress={() => handleAction('Voltear cámara')} style={styles.topBtn}>
            <Ionicons name="camera-reverse-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Duration selector */}
        <View style={styles.durationRow}>
          {DURATIONS.map((d, i) => (
            <TouchableOpacity key={d} style={[styles.durationChip, i === 1 && styles.durationActive]}>
              <Text style={[styles.durationText, i === 1 && styles.durationTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Right tools */}
        <View style={styles.rightTools}>
          {EFFECTS.map(e => (
            <TouchableOpacity key={e.id} style={styles.effectBtn} onPress={() => handleAction(e.label)}>
              <Ionicons name={e.icon} size={18} color={COLORS.white} />
              <Text style={styles.effectText}>{e.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.galleryBtn}
            onPress={() => handleAction('Galería')}
          >
            <View style={styles.galleryThumb} />
            <Text style={styles.galleryLabel}>Galería</Text>
          </TouchableOpacity>

          {/* Record button */}
          <TouchableOpacity
            style={styles.recordOuter}
            onPress={() => handleAction('Grabación de video')}
            activeOpacity={0.85}
          >
            <View style={styles.recordInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.templateBtn}
            onPress={() => handleAction('Plantillas')}
          >
            <Ionicons name="copy-outline" size={24} color={COLORS.white} />
            <Text style={styles.templateLabel}>Plantillas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  viewfinder: {
    flex: 1,
    backgroundColor: '#0D1117',
    position: 'relative',
    overflow: 'hidden',
  },

  // Grid lines
  gridH1: { position: 'absolute', top: '33%', left: 0, right: 0, height: 0.5, backgroundColor: 'rgba(255,255,255,0.12)' },
  gridH2: { position: 'absolute', top: '66%', left: 0, right: 0, height: 0.5, backgroundColor: 'rgba(255,255,255,0.12)' },
  gridV1: { position: 'absolute', left: '33%', top: 0, bottom: 0, width: 0.5, backgroundColor: 'rgba(255,255,255,0.12)' },
  gridV2: { position: 'absolute', left: '66%', top: 0, bottom: 0, width: 0.5, backgroundColor: 'rgba(255,255,255,0.12)' },

  crosshair: { position: 'absolute', top: '47%', alignSelf: 'center' },

  topBar: {
    position: 'absolute',
    top: 14,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBtn: {
    padding: 6,
  },
  viewfinderLabel: {
    fontSize: 11,
    fontWeight: FONT.weight.bold,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
  },
  durationRow: {
    position: 'absolute',
    top: 56,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: RADIUS.full,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  durationChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  durationActive: { backgroundColor: COLORS.white },
  durationText: { fontSize: FONT.size.xs, color: 'rgba(255,255,255,0.6)', fontWeight: FONT.weight.medium },
  durationTextActive: { color: COLORS.black, fontWeight: FONT.weight.bold },

  rightTools: {
    position: 'absolute',
    right: SPACING.md,
    top: '30%',
    gap: 10,
    alignItems: 'center',
  },
  effectBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minWidth: 54,
  },
  effectText: { fontSize: 10, color: COLORS.white, fontWeight: FONT.weight.medium },

  bottomControls: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.xl,
  },
  galleryBtn: { alignItems: 'center', gap: 4 },
  galleryThumb: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  galleryLabel: { fontSize: 11, color: COLORS.white },

  recordOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
  },

  templateBtn: { alignItems: 'center', gap: 4 },
  templateLabel: { fontSize: 11, color: COLORS.white },
});
