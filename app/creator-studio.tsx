import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { ProgressBar } from '@/components/ProgressBar';
import { MY_PROFILE } from '@/data/mocks';
import { useMonetization } from '@/context/MonetizationContext';

const STATS = [
  { label: 'Visualizaciones hoy', value: '3,240', icon: '👁', color: COLORS.accent },
  { label: 'Nuevos seguidores', value: '+124', icon: '◉', color: COLORS.primary },
  { label: 'Tiempo promedio', value: '48s', icon: '⏱', color: COLORS.gold },
  { label: 'Alcance', value: '12.4K', icon: '📡', color: '#A855F7' },
];

export default function CreatorStudioScreen() {
  const { goalsCompleted, simulateGoalsComplete, isPaid } = useMonetization();
  const [animateGoals, setAnimateGoals] = useState(false);

  const followersCurrent = goalsCompleted ? MY_PROFILE.goalsTarget.followers : MY_PROFILE.goalsCurrent.followers;
  const viewsCurrent = goalsCompleted ? MY_PROFILE.goalsTarget.views : MY_PROFILE.goalsCurrent.views;

  function handleSimulate() {
    setAnimateGoals(true);
    simulateGoalsComplete();
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Creator Studio</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Greeting */}
        <View style={styles.greeting}>
          <LinearGradient
            colors={[COLORS.primary + '22', COLORS.accent + '11']}
            style={styles.greetingCard}
          >
            <Text style={styles.greetingEmoji}>⚡</Text>
            <View>
              <Text style={styles.greetingTitle}>Hola, {MY_PROFILE.name.split(' ')[0]}</Text>
              <Text style={styles.greetingSubtitle}>
                {goalsCompleted
                  ? '¡Metas cumplidas! Activa tu monetización'
                  : 'Estás cerca de monetizar tu cuenta'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Progress toward monetization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso hacia monetización</Text>
          <View style={styles.progressCard}>
            <ProgressBar
              label="Seguidores"
              current={followersCurrent}
              total={MY_PROFILE.goalsTarget.followers}
              color={COLORS.primary}
              animate={animateGoals}
            />
            <View style={styles.divider} />
            <ProgressBar
              label="Visualizaciones"
              current={viewsCurrent}
              total={MY_PROFILE.goalsTarget.views}
              color={COLORS.accent}
              animate={animateGoals}
            />

            {/* Unlock / locked button */}
            <View style={styles.btnWrapper}>
              {goalsCompleted ? (
                <TouchableOpacity
                  style={styles.btnUnlocked}
                  onPress={() => router.push('/payment')}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[COLORS.gold, '#FF8C00']}
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.btnUnlockedText}>🎉 ¡Activa tu Monetización!</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={styles.btnLocked}>
                  <Text style={styles.btnLockedText}>
                    🔒 Activar Monetización (Requiere cumplir metas)
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas de hoy</Text>
          <View style={styles.statsGrid}>
            {STATS.map(stat => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consejos para crecer</Text>
          {[
            { icon: '🎬', tip: 'Publica entre 7-9 PM para mayor alcance en LATAM' },
            { icon: '🔁', tip: 'Los videos de 15-30s tienen 40% más retención' },
            { icon: '#',  tip: 'Usa 3-5 hashtags relevantes, no más de 10' },
          ].map((item, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipIconWrap}>
                <Text style={styles.tipIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.tipText}>{item.tip}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Hidden test button — tiny, same color as bg, but touchable */}
      <TouchableOpacity
        style={styles.hiddenBtn}
        onPress={handleSimulate}
        activeOpacity={1}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Text style={styles.hiddenBtnText}>🧪</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 28, color: COLORS.white, lineHeight: 32 },
  title: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },

  greeting: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  greetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '33',
  },
  greetingEmoji: { fontSize: 32 },
  greetingTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },
  greetingSubtitle: { fontSize: FONT.size.sm, color: COLORS.subtext, marginTop: 2 },

  section: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },

  progressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.lg,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  btnWrapper: { marginTop: SPACING.sm },
  btnUnlocked: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnUnlockedText: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.black,
    color: COLORS.black,
  },
  btnLocked: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnLockedText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.medium,
    color: COLORS.muted,
    textAlign: 'center',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statCard: {
    width: '47.5%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  statIcon: { fontSize: 22 },
  statValue: { fontSize: FONT.size.xl, fontWeight: FONT.weight.black },
  statLabel: { fontSize: FONT.size.xs, color: COLORS.subtext },

  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '55',
  },
  tipIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  tipIcon: { fontSize: 16 },
  tipText: {
    flex: 1,
    fontSize: FONT.size.sm,
    color: COLORS.subtext,
    lineHeight: 20,
    paddingTop: SPACING.xs,
  },

  // Hidden test button — invisible text on black background, bottom-right corner
  hiddenBtn: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: 24,
    height: 24,
    opacity: 0.04, // nearly invisible — touchable but not visible in demo
  },
  hiddenBtnText: {
    fontSize: 10,
    color: COLORS.black,
  },
});
