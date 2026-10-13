import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  SafeAreaView, ScrollView, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { useMonetization } from '@/context/MonetizationContext';
import { VIDEOS } from '@/data/mocks';

const RECENT_TXNS = VIDEOS.slice(0, 5).map((v, i) => ({
  id: `w${i}`,
  desc: `Visualizaciones · ${v.username}`,
  amount: +(0.01 + Math.random() * 0.08).toFixed(2),
  time: `${14 - i}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
}));

export default function WalletScreen() {
  const { balance, incrementBalance } = useMonetization();
  const [showModal, setShowModal] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Balance increases every 3 seconds
  useEffect(() => {
    const interval = setInterval(incrementBalance, 3000);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation on balance change
  useEffect(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.08, duration: 150, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [balance]);

  function handleWithdraw() {
    setShowModal(false);
    setWithdrawn(true);
    setTimeout(() => setWithdrawn(false), 4000);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mi Billetera</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Balance hero */}
        <LinearGradient
          colors={['#1A1400', '#0A0A0A']}
          style={styles.balanceHero}
        >
          {/* Live indicator */}
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Generando desde visualizaciones...</Text>
          </View>

          <Text style={styles.balanceLabel}>Saldo acumulado</Text>
          <Animated.Text style={[styles.balanceAmount, { transform: [{ scale: pulseAnim }] }]}>
            ${balance.toFixed(2)}
            <Text style={styles.balanceCurrency}> USD</Text>
          </Animated.Text>

          <Text style={styles.balanceSub}>
            +$0.01 por cada 1,000 visualizaciones
          </Text>

          {/* Withdraw button */}
          {withdrawn ? (
            <View style={styles.withdrawnBanner}>
              <Text style={styles.withdrawnText}>
                ✅ Retiro solicitado · Recibirás tu pago en 24-48h
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.withdrawBtn}
              onPress={() => setShowModal(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.withdrawBtnText}>Solicitar Retiro</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Este mes', value: '$14.50', icon: '📅' },
            { label: 'Total ganado', value: '$31.20', icon: '💰' },
            { label: 'Retiros', value: '$16.70', icon: '↗' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingresos recientes</Text>
          <View style={styles.txnList}>
            {RECENT_TXNS.map(txn => (
              <View key={txn.id} style={styles.txnRow}>
                <View style={styles.txnIconWrap}>
                  <Text style={styles.txnIcon}>👁</Text>
                </View>
                <View style={styles.txnInfo}>
                  <Text style={styles.txnDesc}>{txn.desc}</Text>
                  <Text style={styles.txnTime}>hoy · {txn.time}</Text>
                </View>
                <Text style={styles.txnAmount}>+${txn.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cómo funciona</Text>
          <View style={styles.howList}>
            {[
              { step: '1', text: 'Tus videos acumulan visualizaciones en tiempo real' },
              { step: '2', text: 'Ganas $0.01 por cada 1,000 visualizaciones' },
              { step: '3', text: 'Solicita retiro cuando alcances $10.00 mínimo' },
              { step: '4', text: 'Recibe tu pago en 24-48 horas hábiles' },
            ].map(item => (
              <View key={item.step} style={styles.howRow}>
                <View style={styles.howStep}>
                  <Text style={styles.howStepText}>{item.step}</Text>
                </View>
                <Text style={styles.howText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Withdraw modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Confirmar retiro</Text>
            <Text style={styles.modalSubtitle}>
              Solicitar retiro de tu saldo disponible
            </Text>
            <View style={styles.modalAmountRow}>
              <Text style={styles.modalAmountLabel}>Monto a retirar</Text>
              <Text style={styles.modalAmount}>${balance.toFixed(2)} USD</Text>
            </View>
            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoIcon}>ℹ</Text>
              <Text style={styles.modalInfoText}>
                El pago se procesa en 24-48 horas hábiles a tu cuenta bancaria o billetera crypto registrada.
              </Text>
            </View>
            <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleWithdraw} activeOpacity={0.85}>
              <LinearGradient
                colors={[COLORS.primary, '#CC0033']}
                style={styles.modalConfirmGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalConfirmText}>Confirmar retiro</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  balanceHero: {
    margin: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gold + '33',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  liveDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.success,
    // simple pulsing via opacity would need Animated — keep static for simplicity
  },
  liveText: { fontSize: FONT.size.xs, color: COLORS.success },
  balanceLabel: { fontSize: FONT.size.sm, color: COLORS.subtext },
  balanceAmount: {
    fontSize: 52,
    fontWeight: FONT.weight.black,
    color: COLORS.gold,
    lineHeight: 60,
  },
  balanceCurrency: { fontSize: FONT.size.xl, fontWeight: FONT.weight.semibold, color: COLORS.subtext },
  balanceSub: { fontSize: FONT.size.xs, color: COLORS.muted },
  withdrawBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: SPACING.xl,
  },
  withdrawBtnText: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.black },
  withdrawnBanner: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.success + '22',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.success + '44',
  },
  withdrawnText: { fontSize: FONT.size.sm, color: COLORS.success, textAlign: 'center' },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: { fontSize: 18 },
  statValue: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.white },
  statLabel: { fontSize: FONT.size.xs, color: COLORS.muted },

  section: { paddingHorizontal: SPACING.md, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white, marginBottom: SPACING.md },

  txnList: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '55',
  },
  txnIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: 'center', justifyContent: 'center',
  },
  txnIcon: { fontSize: 16 },
  txnInfo: { flex: 1 },
  txnDesc: { fontSize: FONT.size.sm, color: COLORS.white, fontWeight: FONT.weight.medium },
  txnTime: { fontSize: FONT.size.xs, color: COLORS.muted, marginTop: 2 },
  txnAmount: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.success },

  howList: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  howRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '55',
  },
  howStep: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  howStepText: { fontSize: FONT.size.xs, fontWeight: FONT.weight.black, color: COLORS.white },
  howText: { flex: 1, fontSize: FONT.size.sm, color: COLORS.subtext, lineHeight: 20 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  modalHandle: {
    width: 40, height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.sm,
  },
  modalTitle: { fontSize: FONT.size.xl, fontWeight: FONT.weight.black, color: COLORS.white },
  modalSubtitle: { fontSize: FONT.size.sm, color: COLORS.subtext },
  modalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalAmountLabel: { fontSize: FONT.size.md, color: COLORS.subtext },
  modalAmount: { fontSize: FONT.size.xl, fontWeight: FONT.weight.black, color: COLORS.gold },
  modalInfoRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: COLORS.accent + '11',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accent + '33',
  },
  modalInfoIcon: { fontSize: 16, color: COLORS.accent },
  modalInfoText: { flex: 1, fontSize: FONT.size.sm, color: COLORS.subtext, lineHeight: 20 },
  modalConfirmBtn: { borderRadius: RADIUS.md, overflow: 'hidden' },
  modalConfirmGradient: { paddingVertical: 16, alignItems: 'center' },
  modalConfirmText: { fontSize: FONT.size.lg, fontWeight: FONT.weight.black, color: COLORS.white },
  modalCancelBtn: { alignItems: 'center', paddingVertical: SPACING.sm },
  modalCancelText: { fontSize: FONT.size.md, color: COLORS.subtext },
});
