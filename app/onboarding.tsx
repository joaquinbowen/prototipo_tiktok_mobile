import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { CATEGORIES } from '@/data/mocks';

export default function OnboardingScreen() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function handleContinue() {
    router.replace('/(tabs)');
  }

  const canContinue = selected.length >= 3;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.step}>2 de 2</Text>
          <Text style={styles.title}>¿Qué tipo de contenido{'\n'}te interesa?</Text>
          <Text style={styles.hint}>
            Elige al menos 3 categorías para personalizar tu feed
          </Text>
        </View>

        {/* Categories grid */}
        <View style={styles.grid}>
          {CATEGORIES.map(cat => {
            const isSelected = selected.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  isSelected && { backgroundColor: cat.color, borderColor: cat.color },
                ]}
                onPress={() => toggle(cat.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Counter */}
        <Text style={styles.counter}>
          {selected.length} de 6 seleccionadas
          {selected.length < 3 && (
            <Text style={styles.counterHint}> · elige {3 - selected.length} más</Text>
          )}
        </Text>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.btn, !canContinue && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, !canContinue && styles.btnTextDisabled]}>
            Empezar a explorar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  inner: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  step: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.medium,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FONT.size.xxl,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    lineHeight: 36,
    marginBottom: SPACING.sm,
  },
  hint: {
    fontSize: FONT.size.md,
    color: COLORS.subtext,
    lineHeight: 22,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    alignContent: 'flex-start',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    width: '47%',
  },
  chipEmoji: {
    fontSize: 22,
  },
  chipLabel: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.semibold,
    color: COLORS.subtext,
  },
  chipLabelSelected: {
    color: COLORS.white,
  },
  counter: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.medium,
    color: COLORS.subtext,
    textAlign: 'center',
    marginVertical: SPACING.md,
  },
  counterHint: {
    color: COLORS.muted,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: COLORS.surface,
  },
  btnText: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  btnTextDisabled: {
    color: COLORS.muted,
  },
});
