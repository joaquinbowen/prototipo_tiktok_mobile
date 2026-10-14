import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Animated, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { ProgressBar } from '@/components/ProgressBar';
import { useMonetization } from '@/context/MonetizationContext';

export default function CreatorStudioScreen() {
  const {
    stage,
    goalsCompleted,
    isPaid,
    isMature,
    balance,
    revenueStreams,
    profile,
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
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 150, useNativeDriver: true }),
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
    Alert.alert('¡Metas Alcanzadas!', 'Has completado 10,000 seguidores y 100,000 visualizaciones. El botón de activación está listo.');
  }

  function handleSimulateStep2() {
    simulateMatureTrajectory();
    Alert.alert('¡Trayectoria Simulada!', 'Se han calculado ingresos por videos, batallas y transmisiones en vivo.');
  }

  function handleConfirmReset() {
    Alert.alert(
      'Reiniciar Demostración',
      '¿Deseas volver la cuenta al estado inicial?',
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

  const followersCurrent = goalsCompleted ? 10000 : 8500;
  const viewsCurrent = goalsCompleted ? 100000 : 85000;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Creator Studio</Text>
        <TouchableOpacity onPress={handleConfirmReset} style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="refresh" size={20} color={COLORS.subtext} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Unified Dark Creator Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{profile.name.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.profileNameRow}>
              <Text style={styles.profileName}>{profile.name}</Text>
              {isPaid && (
                <View style={styles.verifiedPill}>
                  <Ionicons name="checkmark-circle" size={12} color="#D4AF37" />
                  <Text style={styles.verifiedPillText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.profileCategory}>{profile.category}</Text>
            <Text style={styles.profileStatus}>
              {isMature
                ? 'Monetización completa · Vistas, Lives y Batallas'
                : isPaid
                ? 'Monetización aprobada · Comienza a generar'
                : goalsCompleted
                ? 'Metas cumplidas · Pendiente de activación'
                : 'Metas en progreso para monetizar'}
            </Text>
          </View>
        </View>

        {/* ============================================================== */}
        {/* HERO WALLET CARD (WHEN MATURE)                                 */}
        {/* ============================================================== */}
        {isMature && (
          <View style={styles.section}>
            <View style={styles.walletHeroCard}>
              <View style={styles.walletHeaderRow}>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>GENERANDO EN TIEMPO REAL</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/wallet')} activeOpacity={0.7}>
                  <Text style={styles.walletDetailLink}>Historial y retiros ›</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.walletLabel}>Saldo disponible en billetera</Text>
              <Animated.Text style={[styles.walletAmount, { transform: [{ scale: pulseAnim }] }]}>
                ${balance.toFixed(2)}
                <Text style={styles.walletCurrency}> USD</Text>
              </Animated.Text>

              {/* Multi-stream revenue summary badges */}
              <View style={styles.streamGrid}>
                <View style={styles.streamItem}>
                  <Ionicons name="videocam-outline" size={15} color="#D4AF37" />
                  <Text style={styles.streamLabel}>Videos</Text>
                  <Text style={styles.streamVal}>${revenueStreams.views.toFixed(2)}</Text>
                </View>
                <View style={styles.streamItem}>
                  <Ionicons name="gift-outline" size={15} color="#D4AF37" />
                  <Text style={styles.streamLabel}>Regalos Live</Text>
                  <Text style={styles.streamVal}>${revenueStreams.liveGifts.toFixed(2)}</Text>
                </View>
                <View style={styles.streamItem}>
                  <Ionicons name="flame-outline" size={15} color="#D4AF37" />
                  <Text style={styles.streamLabel}>Batallas</Text>
                  <Text style={styles.streamVal}>${revenueStreams.liveBattles.toFixed(2)}</Text>
                </View>
                <View style={styles.streamItem}>
                  <Ionicons name="people-outline" size={15} color="#D4AF37" />
                  <Text style={styles.streamLabel}>Suscripciones</Text>
                  <Text style={styles.streamVal}>${revenueStreams.subscriptions.toFixed(2)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.btnWithdrawAction}
                onPress={() => router.push('/wallet')}
                activeOpacity={0.85}
              >
                <Ionicons name="wallet-outline" size={16} color="#000000" style={{ marginRight: 6 }} />
                <Text style={styles.btnWithdrawActionText}>Gestionar Billetera y Retirar Fondos</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* STEP 2 SIMULATION CALLOUT (STAGE: paid_fresh)                  */}
        {/* ============================================================== */}
        {stage === 'paid_fresh' && (
          <View style={styles.section}>
            <View style={styles.demoBox}>
              <View style={styles.demoTag}>
                <Text style={styles.demoTagText}>PASO 2 DE DEMOSTRACIÓN</Text>
              </View>
              <Text style={styles.demoTitle}>Simula el tráfico, transmisiones y batallas</Text>
              <Text style={styles.demoDesc}>
                Tu suscripción está confirmada. Simula transmisiones en vivo, batallas ganadas y miles de reproducciones para activar la billetera y métricas de ingresos.
              </Text>
              <TouchableOpacity
                style={styles.btnSimulateAction}
                onPress={handleSimulateStep2}
                activeOpacity={0.85}
              >
                <Ionicons name="trending-up" size={16} color="#000000" style={{ marginRight: 6 }} />
                <Text style={styles.btnSimulateActionText}>Simular Trayectoria y Ganancias</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* GOALS PROGRESS (STAGE: initial & goals_met)                    */}
        {/* ============================================================== */}
        {!isPaid && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progreso hacia monetización</Text>
            <View style={styles.darkCard}>
              <ProgressBar
                label="Seguidores"
                current={followersCurrent}
                total={10000}
                color="#D4AF37"
                animate={animateGoals}
              />
              <View style={styles.cardDivider} />
              <ProgressBar
                label="Visualizaciones"
                current={viewsCurrent}
                total={100000}
                color="#D4AF37"
                animate={animateGoals}
              />

              <View style={{ marginTop: 12 }}>
                {goalsCompleted ? (
                  <TouchableOpacity
                    style={styles.btnActivate}
                    onPress={() => router.push('/payment')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="card-outline" size={16} color="#000000" style={{ marginRight: 8 }} />
                    <Text style={styles.btnActivateText}>Activar Monetización ($9.99/mes)</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.btnLocked}>
                    <Ionicons name="lock-closed-outline" size={14} color={COLORS.muted} style={{ marginRight: 6 }} />
                    <Text style={styles.btnLockedText}>
                      Monetización bloqueada · Requiere 10K seguidores y 100K vistas
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* STEP 1 SIMULATION CALLOUT (STAGE: initial)                     */}
        {/* ============================================================== */}
        {stage === 'initial' && (
          <View style={styles.section}>
            <View style={styles.demoBox}>
              <View style={styles.demoTag}>
                <Text style={styles.demoTagText}>PASO 1 DE DEMOSTRACIÓN</Text>
              </View>
              <Text style={styles.demoTitle}>Simula el alcance de metas de creador</Text>
              <Text style={styles.demoDesc}>
                Aumenta automáticamente los seguidores y reproducciones al 100% para habilitar la pasarela de pago.
              </Text>
              <TouchableOpacity
                style={styles.btnSimulateAction}
                onPress={handleSimulateStep1}
                activeOpacity={0.85}
              >
                <Ionicons name="flash" size={16} color="#000000" style={{ marginRight: 6 }} />
                <Text style={styles.btnSimulateActionText}>Simular Metas Cumplidas (100%)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* STATS OVERVIEW (ALIGNED WITH PLATFORM KPIs)                    */}
        {/* ============================================================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isMature ? 'Métricas de Creador y Audiencia' : 'Estadísticas del Canal'}
          </Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>{isMature ? 'RPM Promedio' : 'Vistas hoy'}</Text>
              <Text style={styles.kpiValue}>{isMature ? '$0.85 USD' : '3,240'}</Text>
              <Text style={styles.kpiSub}>por cada 1,000 reproducciones</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>{isMature ? 'Estimado Mensual' : 'Nuevos fans'}</Text>
              <Text style={styles.kpiValue}>{isMature ? '$348.50' : '+124'}</Text>
              <Text style={styles.kpiSub}>proyección de cobro LATAM</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>{isMature ? 'Alcance Total' : 'Retención media'}</Text>
              <Text style={styles.kpiValue}>{isMature ? '410.2K' : '48s'}</Text>
              <Text style={styles.kpiSub}>usuarios alcanzados</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>{isMature ? 'Regalos / Batallas' : 'Engagement'}</Text>
              <Text style={styles.kpiValue}>{isMature ? '142 enviados' : '8.4%'}</Text>
              <Text style={styles.kpiSub}>interacciones en vivo</Text>
            </View>
          </View>
        </View>

        {/* ============================================================== */}
        {/* TOP REVENUE GENERATORS (WHEN MATURE)                           */}
        {/* ============================================================== */}
        {isMature && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fuentes Principales de Ingresos</Text>
            <View style={styles.darkCard}>
              <View style={styles.rankingRow}>
                <View style={styles.rankingIconWrap}>
                  <Ionicons name="flame" size={16} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rankingTitle}>Batalla Live vs @carlosgamer_col</Text>
                  <Text style={styles.rankingMeta}>Ganada · 18.4K espectadores · ayer</Text>
                </View>
                <Text style={styles.rankingEarned}>+$32.00</Text>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.rankingRow}>
                <View style={styles.rankingIconWrap}>
                  <Ionicons name="videocam" size={16} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rankingTitle}>Video: Ceviche tradicional fácil en 5 min</Text>
                  <Text style={styles.rankingMeta}>210K reproducciones · Feed Para Ti</Text>
                </View>
                <Text style={styles.rankingEarned}>+$17.85</Text>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.rankingRow}>
                <View style={styles.rankingIconWrap}>
                  <Ionicons name="gift" size={16} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rankingTitle}>Transmisión en Vivo: Preguntas y Cocina</Text>
                  <Text style={styles.rankingMeta}>76 regalos recibidos · hace 3 días</Text>
                </View>
                <Text style={styles.rankingEarned}>+$15.50</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerBtn: {
    padding: 6,
  },
  title: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  // Profile Header Card
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: '#111111',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  profileAvatarText: {
    fontSize: 20,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(212,175,55,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  verifiedPillText: {
    fontSize: 9,
    fontWeight: FONT.weight.bold,
    color: '#D4AF37',
  },
  profileCategory: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    marginTop: 2,
  },
  profileStatus: {
    fontSize: FONT.size.xs,
    color: '#D4AF37',
    marginTop: 3,
  },

  section: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: FONT.weight.semibold,
    color: COLORS.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },

  // Dark Card
  darkCard: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 10,
  },

  // Wallet Hero
  walletHeroCard: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  walletHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  liveText: {
    fontSize: 10,
    fontWeight: FONT.weight.bold,
    color: '#4ADE80',
    letterSpacing: 0.5,
  },
  walletDetailLink: {
    fontSize: FONT.size.xs,
    color: '#D4AF37',
    fontWeight: FONT.weight.medium,
  },
  walletLabel: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    marginTop: 4,
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginVertical: 4,
  },
  walletCurrency: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.semibold,
    color: '#D4AF37',
  },

  // Stream Grid
  streamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  streamItem: {
    width: '48%',
    backgroundColor: '#181818',
    borderRadius: RADIUS.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  streamLabel: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 4,
  },
  streamVal: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginTop: 2,
  },

  btnWithdrawAction: {
    backgroundColor: '#D4AF37',
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnWithdrawActionText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: '#000000',
  },

  // Demo Box
  demoBox: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  demoTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#1C1C1C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  demoTagText: {
    fontSize: 10,
    fontWeight: FONT.weight.bold,
    color: '#D4AF37',
    letterSpacing: 0.5,
  },
  demoTitle: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  demoDesc: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    lineHeight: 18,
    marginBottom: 12,
  },
  btnSimulateAction: {
    backgroundColor: '#D4AF37',
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSimulateActionText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: '#000000',
  },

  // Activation & Locked
  btnActivate: {
    backgroundColor: '#D4AF37',
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActivateText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: '#000000',
  },
  btnLocked: {
    backgroundColor: '#181818',
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  btnLockedText: {
    fontSize: 11,
    color: COLORS.muted,
  },

  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kpiCard: {
    width: '48.5%',
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  kpiLabel: {
    fontSize: 11,
    color: COLORS.subtext,
  },
  kpiValue: {
    fontSize: 17,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 10,
    color: COLORS.muted,
  },

  // Ranking Rows
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  rankingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankingTitle: {
    fontSize: FONT.size.xs,
    fontWeight: FONT.weight.semibold,
    color: COLORS.white,
  },
  rankingMeta: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 2,
  },
  rankingEarned: {
    fontSize: FONT.size.xs,
    fontWeight: FONT.weight.bold,
    color: '#4ADE80',
  },
});
