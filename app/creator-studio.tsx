import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Animated, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from '@/components/LinearGradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { ProgressBar } from '@/components/ProgressBar';
import { MY_PROFILE } from '@/data/mocks';
import { useMonetization } from '@/context/MonetizationContext';

const INITIAL_STATS = [
  { label: 'Visualizaciones hoy', value: '3,240', icon: 'eye-outline', color: COLORS.accent },
  { label: 'Nuevos seguidores', value: '+124', icon: 'person-add-outline', color: COLORS.primary },
  { label: 'Tiempo promedio', value: '48s', icon: 'time-outline', color: COLORS.gold },
  { label: 'Alcance', value: '12.4K', icon: 'radio-outline', color: '#A855F7' },
];

const MATURE_STATS = [
  { label: 'RPM Promedio', value: '$0.85', icon: 'trending-up-outline', color: COLORS.accent },
  { label: 'Estimado mensual', value: '$348.50', icon: 'cash-outline', color: COLORS.gold },
  { label: 'Reproducciones', value: '410.2K', icon: 'play-outline', color: COLORS.primary },
  { label: 'Retención media', value: '52s', icon: 'stopwatch-outline', color: '#A855F7' },
];

const TOP_MONETIZED_VIDEOS = [
  { id: '1', title: 'Ceviche tradicional fácil en 5 min', views: '210K', earned: '$17.85', time: 'hace 2 días' },
  { id: '2', title: 'Rutina funcional express en casa', views: '145K', earned: '$12.30', time: 'hace 4 días' },
  { id: '3', title: 'Setup minimalista de trabajo 2026', views: '89K', earned: '$7.56', time: 'hace 1 semana' },
];

export default function CreatorStudioScreen() {
  const {
    stage,
    goalsCompleted,
    isPaid,
    isMature,
    balance,
    simulateGoalsComplete,
    simulateMatureTrajectory,
    resetDemo,
    incrementBalance,
  } = useMonetization();

  const [animateGoals, setAnimateGoals] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when balance updates in mature mode
  useEffect(() => {
    if (isMature) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [balance, isMature]);

  // Real-time ticker when mature
  useEffect(() => {
    if (isMature) {
      const interval = setInterval(incrementBalance, 2500);
      return () => clearInterval(interval);
    }
  }, [isMature]);

  function handleSimulateStep1() {
    setAnimateGoals(true);
    simulateGoalsComplete();
    Alert.alert('¡Meta Alcanzada!', 'Has cumplido 10K seguidores y 100K reproducciones. Ahora puedes proceder al pago de activación.');
  }

  function handleSimulateStep2() {
    simulateMatureTrajectory();
    Alert.alert('¡Trayectoria Simulada!', 'Tus nuevos videos han sumado miles de reproducciones. Tu billetera y estadísticas completas de ingresos están activas.');
  }

  function handleConfirmReset() {
    Alert.alert(
      'Reiniciar Demostración',
      '¿Deseas restaurar la cuenta al estado inicial (sin cumplir metas ni pago)?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: () => {
            setAnimateGoals(false);
            resetDemo();
          },
        },
      ]
    );
  }

  const followersCurrent = goalsCompleted ? MY_PROFILE.goalsTarget.followers : MY_PROFILE.goalsCurrent.followers;
  const viewsCurrent = goalsCompleted ? MY_PROFILE.goalsTarget.views : MY_PROFILE.goalsCurrent.views;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={26} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Creator Studio</Text>
        <TouchableOpacity onPress={handleConfirmReset} style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="refresh" size={22} color={COLORS.subtext} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Greeting Card */}
        <View style={styles.greeting}>
          <LinearGradient
            colors={
              isMature
                ? ['rgba(255,215,0,0.18)', 'rgba(0,242,254,0.10)']
                : isPaid
                ? ['rgba(0,242,254,0.15)', 'rgba(254,44,85,0.08)']
                : goalsCompleted
                ? ['rgba(255,215,0,0.2)', 'rgba(254,44,85,0.1)']
                : ['rgba(254,44,85,0.15)', 'rgba(0,242,254,0.08)']
            }
            style={styles.greetingCard}
          >
            <View style={styles.greetingIconWrap}>
              <Ionicons
                name={isMature ? "trophy" : isPaid ? "checkmark-circle" : goalsCompleted ? "star" : "flash"}
                size={26}
                color={isMature ? COLORS.gold : isPaid ? COLORS.accent : COLORS.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.greetingTitle}>Hola, {MY_PROFILE.name.split(' ')[0]}</Text>
              <Text style={styles.greetingSubtitle}>
                {isMature
                  ? 'Cuenta verificada · Generando ingresos en vivo'
                  : isPaid
                  ? '¡Monetización aprobada! Sube videos para cobrar'
                  : goalsCompleted
                  ? '¡Metas cumplidas! Activa tu monetización'
                  : 'Estás cerca de monetizar tu contenido'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* ============================================================== */}
        {/* STAGE 4: MATURE CREATOR WALLET HERO & DETAILED ANALYTICS       */}
        {/* ============================================================== */}
        {isMature && (
          <View style={styles.section}>
            <View style={styles.walletHeroCard}>
              <LinearGradient
                colors={['#1F1705', '#0D0D0D']}
                style={styles.walletHeroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.liveBadgeRow}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.liveBadgeText}>GENERANDO EN TIEMPO REAL</Text>
                </View>

                <Text style={styles.walletLabel}>Saldo acumulado disponible</Text>
                <Animated.Text style={[styles.walletAmount, { transform: [{ scale: pulseAnim }] }]}>
                  ${balance.toFixed(2)}
                  <Text style={styles.walletCurrency}> USD</Text>
                </Animated.Text>

                <Text style={styles.walletRateText}>
                  + $0.01 por cada 1,000 visualizaciones en LATAM
                </Text>

                <TouchableOpacity
                  style={styles.btnWalletAction}
                  onPress={() => router.push('/wallet')}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[COLORS.gold, '#FF8C00']}
                    style={styles.btnWalletGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="wallet-outline" size={18} color={COLORS.black} style={{ marginRight: 6 }} />
                    <Text style={styles.btnWalletActionText}>Ver Billetera y Solicitar Retiro</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* STAGE 3: FRESH PAID CREATOR - STEP 2 SIMULATION CALLOUT         */}
        {/* ============================================================== */}
        {stage === 'paid_fresh' && (
          <View style={styles.section}>
            <View style={styles.stepBox}>
              <LinearGradient
                colors={['rgba(255,215,0,0.12)', 'rgba(20,20,20,0.9)']}
                style={styles.stepBoxGradient}
              >
                <View style={styles.stepHeaderRow}>
                  <View style={styles.stepPill}>
                    <Text style={styles.stepPillText}>DEMO · PASO 2</Text>
                  </View>
                  <Text style={styles.stepStatusText}>Suscripción Activa ($9.99/mes)</Text>
                </View>

                <Text style={styles.stepTitle}>Simula el tráfico y trayectoria</Text>
                <Text style={styles.stepDesc}>
                  Tu cuenta ya tiene la monetización habilitada. Presiona el botón para simular la publicación de nuevos videos, incremento de vistas y desglose de ganancias.
                </Text>

                <TouchableOpacity
                  style={styles.btnStep2}
                  onPress={handleSimulateStep2}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[COLORS.gold, '#E5A00D']}
                    style={styles.btnStepGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="trending-up" size={20} color={COLORS.black} style={{ marginRight: 6 }} />
                    <Text style={styles.btnStep2Text}>📈 Simular Trayectoria y Ganancias</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* STAGE 1 & 2: GOALS PROGRESS CARD                               */}
        {/* ============================================================== */}
        {(!isPaid) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Progreso hacia monetización</Text>
              <Text style={styles.sectionSubtitle}>
                {goalsCompleted ? 'Requisitos cumplidos (100%)' : '85% completado'}
              </Text>
            </View>

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

              {/* Unlock or Locked CTA */}
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
                      <Ionicons name="card-outline" size={20} color={COLORS.black} style={{ marginRight: 8 }} />
                      <Text style={styles.btnUnlockedText}>🎉 ¡Activa tu Monetización!</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.btnLocked}>
                    <Ionicons name="lock-closed" size={16} color={COLORS.muted} style={{ marginRight: 6 }} />
                    <Text style={styles.btnLockedText}>
                      Activar Monetización (Requiere cumplir metas)
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* STAGE 1 SIMULATION BOX: STEP 1 TO REACH GOAL                   */}
        {/* ============================================================== */}
        {stage === 'initial' && (
          <View style={styles.section}>
            <View style={styles.stepBox}>
              <LinearGradient
                colors={['rgba(0,242,254,0.12)', 'rgba(20,20,20,0.9)']}
                style={styles.stepBoxGradient}
              >
                <View style={styles.stepHeaderRow}>
                  <View style={[styles.stepPill, { backgroundColor: 'rgba(0,242,254,0.2)' }]}>
                    <Text style={[styles.stepPillText, { color: COLORS.accent }]}>DEMO · PASO 1</Text>
                  </View>
                  <Text style={styles.stepStatusText}>Usuario sin meta</Text>
                </View>

                <Text style={styles.stepTitle}>Simula el cumplimiento de metas</Text>
                <Text style={styles.stepDesc}>
                  Haz que las barras de seguidores y visualizaciones suban al 100% para habilitar el botón de pago y continuar la presentación.
                </Text>

                <TouchableOpacity
                  style={styles.btnStep1}
                  onPress={handleSimulateStep1}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[COLORS.primary, '#E02047']}
                    style={styles.btnStepGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="flash" size={18} color={COLORS.white} style={{ marginRight: 6 }} />
                    <Text style={styles.btnStep1Text}>⚡ Simular Meta Cumplida (Paso 1)</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* ANALYTICS SECTION (MATURE vs INITIAL)                          */}
        {/* ============================================================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isMature ? 'Analíticas de Rendimiento y Ganancias' : 'Estadísticas del Canal'}
          </Text>
          <View style={styles.statsGrid}>
            {(isMature ? MATURE_STATS : INITIAL_STATS).map(stat => (
              <View key={stat.label} style={styles.statCard}>
                <Ionicons name={stat.icon as any} size={22} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ============================================================== */}
        {/* TOP MONETIZED CONTENT (WHEN MATURE)                           */}
        {/* ============================================================== */}
        {isMature && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Videos Top en Ganancias</Text>
            <View style={styles.videoListWrap}>
              {TOP_MONETIZED_VIDEOS.map((item, idx) => (
                <View key={item.id} style={styles.videoRevenueRow}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.videoRowTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.videoRowMeta}>{item.views} vistas · {item.time}</Text>
                  </View>
                  <View style={styles.earnedPill}>
                    <Text style={styles.earnedText}>{item.earned}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buenas Prácticas para Creadores</Text>
          {[
            { icon: 'time-outline', tip: 'Publica entre 7-9 PM para mayor alcance en LATAM' },
            { icon: 'videocam-outline', tip: 'Los videos de 15-30s tienen 40% más retención' },
            { icon: 'pricetag-outline', tip: 'Usa 3-5 hashtags relevantes, evita saturar' },
          ].map((item, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipIconWrap}>
                <Ionicons name={item.icon as any} size={18} color={COLORS.subtext} />
              </View>
              <Text style={styles.tipText}>{item.tip}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
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
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerBtn: { padding: 4 },
  title: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },

  greeting: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  greetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  greetingIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },
  greetingSubtitle: { fontSize: FONT.size.sm, color: COLORS.subtext, marginTop: 2 },

  section: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    marginTop: 2,
  },

  // Wallet hero (mature)
  walletHeroCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  walletHeroGradient: {
    padding: SPACING.lg,
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: FONT.weight.bold,
    color: '#00E676',
    letterSpacing: 0.8,
  },
  walletLabel: {
    fontSize: FONT.size.sm,
    color: COLORS.subtext,
    marginTop: 4,
  },
  walletAmount: {
    fontSize: 36,
    fontWeight: FONT.weight.black,
    color: COLORS.white,
    marginVertical: 4,
  },
  walletCurrency: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.semibold,
    color: COLORS.gold,
  },
  walletRateText: {
    fontSize: FONT.size.xs,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: SPACING.md,
  },
  btnWalletAction: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  btnWalletGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  btnWalletActionText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.black,
  },

  // Step box
  stepBox: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  stepBoxGradient: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepPill: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stepPillText: {
    fontSize: 10,
    fontWeight: FONT.weight.black,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  stepStatusText: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
  },
  stepTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  stepDesc: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    lineHeight: 18,
  },
  btnStep1: {
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginTop: 4,
  },
  btnStep2: {
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginTop: 4,
  },
  btnStepGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  btnStep1Text: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  btnStep2Text: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.black,
  },

  // Progress card
  progressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  btnWrapper: { marginTop: 4 },
  btnUnlocked: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  btnUnlockedText: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.black,
  },
  btnLocked: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnLockedText: {
    fontSize: FONT.size.xs,
    fontWeight: FONT.weight.medium,
    color: COLORS.muted,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  statValue: { fontSize: FONT.size.xl, fontWeight: FONT.weight.black },
  statLabel: { fontSize: FONT.size.xs, color: COLORS.subtext },

  // Top videos list
  videoListWrap: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
  videoRevenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rankBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,215,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 11,
    fontWeight: FONT.weight.bold,
    color: COLORS.gold,
  },
  videoRowTitle: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    color: COLORS.white,
  },
  videoRowMeta: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    marginTop: 2,
  },
  earnedPill: {
    backgroundColor: 'rgba(0,230,118,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  earnedText: {
    fontSize: FONT.size.xs,
    fontWeight: FONT.weight.bold,
    color: '#00E676',
  },

  // Tips
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '55',
  },
  tipIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  tipText: {
    flex: 1,
    fontSize: FONT.size.sm,
    color: COLORS.subtext,
    lineHeight: 19,
    paddingTop: 2,
  },
});
