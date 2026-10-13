import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';

const DURATIONS = ['15 s', '60 s', '3 min', '10 min'];
const EFFECTS = ['🌟 Filtros', '🎵 Sonidos', '⚡ Efectos', '📝 Texto', '🔗 Enlace'];

export default function CreateScreen() {
  const handleAction = (msg: string) =>
    Alert.alert('Demo', msg + '\nDisponible en la versión final.');

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
          <Text style={styles.crosshairIcon}>+</Text>
        </View>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => handleAction('Flash')}>
            <Text style={styles.topIcon}>⚡</Text>
          </TouchableOpacity>
          <Text style={styles.viewfinderLabel}>Cámara</Text>
          <TouchableOpacity onPress={() => handleAction('Voltear cámara')}>
            <Text style={styles.topIcon}>↻</Text>
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
            <TouchableOpacity key={e} style={styles.effectBtn} onPress={() => handleAction(e)}>
              <Text style={styles.effectText}>{e}</Text>
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
            <Text style={styles.templateIcon}>⊞</Text>
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
  gridH1: { position: 'absolute', top: '33%', left: 0, right: 0, height: 0.5, backgroundColor: 'rgba(255,255,255,0.15)' },
  gridH2: { position: 'absolute', top: '66%', left: 0, right: 0, height: 0.5, backgroundColor: 'rgba(255,255,255,0.15)' },
  gridV1: { position: 'absolute', left: '33%', top: 0, bottom: 0, width: 0.5, backgroundColor: 'rgba(255,255,255,0.15)' },
  gridV2: { position: 'absolute', left: '66%', top: 0, bottom: 0, width: 0.5, backgroundColor: 'rgba(255,255,255,0.15)' },

  crosshair: { position: 'absolute', top: '47%', alignSelf: 'center' },
  crosshairIcon: { fontSize: 32, color: 'rgba(255,255,255,0.2)' },

  topBar: {
    position: 'absolute',
    top: 12,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topIcon: { fontSize: 24, color: COLORS.white },
  viewfinderLabel: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  durationRow: {
    position: 'absolute',
    top: 56,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: RADIUS.full,
    padding: 4,
  },
  durationChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  durationActive: { backgroundColor: COLORS.white },
  durationText: { fontSize: FONT.size.sm, color: 'rgba(255,255,255,0.6)', fontWeight: FONT.weight.medium },
  durationTextActive: { color: COLORS.black, fontWeight: FONT.weight.bold },

  rightTools: {
    position: 'absolute',
    right: SPACING.md,
    top: '35%',
    gap: SPACING.md,
  },
  effectBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  effectText: { fontSize: FONT.size.xs, color: COLORS.white },

  bottomControls: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.xl,
  },
  galleryBtn: { alignItems: 'center', gap: 4 },
  galleryThumb: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  galleryLabel: { fontSize: FONT.size.xs, color: COLORS.white },

  recordOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
  },

  templateBtn: { alignItems: 'center', gap: 4 },
  templateIcon: { fontSize: 32, color: COLORS.white },
  templateLabel: { fontSize: FONT.size.xs, color: COLORS.white },
});
