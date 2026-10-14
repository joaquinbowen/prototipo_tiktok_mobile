import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  SafeAreaView, ScrollView, Animated, TextInput, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { useMonetization } from '@/context/MonetizationContext';

export default function WalletScreen() {
  const {
    balance,
    incrementBalance,
    withdrawals,
    requestWithdrawal,
    revenueStreams,
    isMature,
  } = useMonetization();

  const [showModal, setShowModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'Binance Pay' | 'Stripe'>('Binance Pay');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('10.00');
  const [activeTab, setActiveTab] = useState<'retiros' | 'ingresos'>('retiros');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Real-time ticker when mature
  useEffect(() => {
    if (isMature) {
      const interval = setInterval(incrementBalance, 2500);
      return () => clearInterval(interval);
    }
  }, [isMature]);

  // Pulse animation on balance change
  useEffect(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.05, duration: 150, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [balance]);

  function handleConfirmWithdrawal() {
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Monto inválido', 'Por favor ingresa un monto mayor a $0.');
      return;
    }
    if (amountNum > balance) {
      Alert.alert('Saldo insuficiente', 'El monto a retirar no puede superar tu saldo acumulado disponible.');
      return;
    }
    const accountStr = withdrawAccount.trim() || (withdrawMethod === 'Binance Pay' ? 'USDT · Pay ID 908124' : 'Banco Pichincha ···4921');
    const success = requestWithdrawal(amountNum, withdrawMethod, accountStr);
    if (success) {
      setShowModal(false);
      setWithdrawAccount('');
      Alert.alert(
        'Solicitud Registrada',
        `Tu solicitud de retiro por $${amountNum.toFixed(2)} USD fue enviada y figura como PENDIENTE. Será procesada en 24-48 horas hábiles.`
      );
    }
  }

  const totalEarnedAllStreams = Math.max(
    balance,
    revenueStreams.views + revenueStreams.liveGifts + revenueStreams.liveBattles + revenueStreams.subscriptions
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Billetera de Creador</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Balance Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.liveBadgeRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>GENERACIÓN ACTIVA EN VIVO</Text>
          </View>

          <Text style={styles.heroLabel}>Saldo disponible para retiro</Text>
          <Animated.Text style={[styles.heroAmount, { transform: [{ scale: pulseAnim }] }]}>
            ${balance.toFixed(2)}
            <Text style={styles.heroCurrency}> USD</Text>
          </Animated.Text>

          <Text style={styles.heroSubText}>
            Videos, Regalos de Lives y Batallas acumulados
          </Text>

          <TouchableOpacity
            style={styles.btnWithdraw}
            onPress={() => setShowModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-up-circle-outline" size={18} color="#000000" style={{ marginRight: 6 }} />
            <Text style={styles.btnWithdrawText}>Solicitar Retiro de Fondos</Text>
          </TouchableOpacity>
        </View>

        {/* Global KPIs */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Generado</Text>
            <Text style={styles.statVal}>${totalEarnedAllStreams.toFixed(2)}</Text>
            <Text style={styles.statSub}>todas las fuentes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Retiros Pagados</Text>
            <Text style={styles.statVal}>$41.70</Text>
            <Text style={styles.statSub}>2 completados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Mínimo Retiro</Text>
            <Text style={styles.statVal}>$10.00</Text>
            <Text style={styles.statSub}>sin comisiones</Text>
          </View>
        </View>

        {/* Tab switcher: Retiros vs Desglose de Ingresos */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'retiros' && styles.tabButtonActive]}
            onPress={() => setActiveTab('retiros')}
          >
            <Text style={[styles.tabText, activeTab === 'retiros' && styles.tabTextActive]}>
              Historial de Retiros
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ingresos' && styles.tabButtonActive]}
            onPress={() => setActiveTab('ingresos')}
          >
            <Text style={[styles.tabText, activeTab === 'ingresos' && styles.tabTextActive]}>
              Desglose por Fuentes
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================== */}
        {/* TAB 1: HISTORIAL DE RETIROS (PENDIENTES Y ENTREGADOS)           */}
        {/* ============================================================== */}
        {activeTab === 'retiros' && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Historial de Solicitudes y Pagos</Text>
            <View style={styles.cardList}>
              {withdrawals.map(item => (
                <View key={item.id} style={styles.withdrawalRow}>
                  <View style={styles.methodIconWrap}>
                    <Ionicons
                      name={item.method === 'Binance Pay' ? 'logo-bitcoin' : 'card-outline'}
                      size={18}
                      color="#D4AF37"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.withdrawalMethod}>{item.method}</Text>
                    <Text style={styles.withdrawalAccount}>{item.account}</Text>
                    <Text style={styles.withdrawalDate}>{item.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={styles.withdrawalAmount}>-${item.amount.toFixed(2)}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        item.status === 'aprobado'
                          ? styles.statusAprobado
                          : item.status === 'pendiente'
                          ? styles.statusPendiente
                          : styles.statusRechazado,
                      ]}
                    >
                      <Ionicons
                        name={
                          item.status === 'aprobado'
                            ? 'checkmark-circle'
                            : item.status === 'pendiente'
                            ? 'time'
                            : 'close-circle'
                        }
                        size={11}
                        color={
                          item.status === 'aprobado'
                            ? '#4ADE80'
                            : item.status === 'pendiente'
                            ? '#D4AF37'
                            : '#EF4444'
                        }
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          item.status === 'aprobado'
                            ? styles.statusTextAprobado
                            : item.status === 'pendiente'
                            ? styles.statusTextPendiente
                            : styles.statusTextRechazado,
                        ]}
                      >
                        {item.status === 'aprobado' ? 'Entregado' : item.status === 'pendiente' ? 'Pendiente' : 'Rechazado'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* TAB 2: DESGLOSE DE INGRESOS (VIDEOS, LIVES, BATALLAS, SUBS)     */}
        {/* ============================================================== */}
        {activeTab === 'ingresos' && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Fuentes de Monetización LATAM</Text>
            <View style={styles.cardList}>
              <View style={styles.streamRow}>
                <View style={styles.streamIconBox}>
                  <Ionicons name="flame" size={18} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.streamTitle}>Batallas en Vivo (PK Battles)</Text>
                  <Text style={styles.streamSub}>Competencias ganadas en streams</Text>
                </View>
                <Text style={styles.streamAmount}>${revenueStreams.liveBattles.toFixed(2)}</Text>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.streamRow}>
                <View style={styles.streamIconBox}>
                  <Ionicons name="gift" size={18} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.streamTitle}>Regalos de Transmisiones (Lives)</Text>
                  <Text style={styles.streamSub}>Diamantes y donaciones en vivo</Text>
                </View>
                <Text style={styles.streamAmount}>${revenueStreams.liveGifts.toFixed(2)}</Text>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.streamRow}>
                <View style={styles.streamIconBox}>
                  <Ionicons name="videocam" size={18} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.streamTitle}>Visualizaciones de Videos (Feed)</Text>
                  <Text style={styles.streamSub}>CPM por cada 1,000 reproducciones</Text>
                </View>
                <Text style={styles.streamAmount}>${revenueStreams.views.toFixed(2)}</Text>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.streamRow}>
                <View style={styles.streamIconBox}>
                  <Ionicons name="people" size={18} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.streamTitle}>Membresías y Suscripciones de Fans</Text>
                  <Text style={styles.streamSub}>Apoyo mensual de tu comunidad</Text>
                </View>
                <Text style={styles.streamAmount}>${revenueStreams.subscriptions.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* WITHDRAWAL MODAL */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Solicitud de Retiro</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={22} color={COLORS.subtext} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalNotice}>
              Saldo disponible actual: <Text style={{ color: '#D4AF37', fontWeight: 'bold' }}>${balance.toFixed(2)} USD</Text>
            </Text>

            {/* Method selection */}
            <Text style={styles.fieldLabel}>Método de Pago</Text>
            <View style={styles.methodChoiceRow}>
              <TouchableOpacity
                style={[styles.methodChoiceBtn, withdrawMethod === 'Binance Pay' && styles.methodChoiceActive]}
                onPress={() => setWithdrawMethod('Binance Pay')}
              >
                <Ionicons name="logo-bitcoin" size={16} color={withdrawMethod === 'Binance Pay' ? '#000000' : '#D4AF37'} />
                <Text style={[styles.methodChoiceText, withdrawMethod === 'Binance Pay' && styles.methodChoiceTextActive]}>
                  Binance Pay
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.methodChoiceBtn, withdrawMethod === 'Stripe' && styles.methodChoiceActive]}
                onPress={() => setWithdrawMethod('Stripe')}
              >
                <Ionicons name="card-outline" size={16} color={withdrawMethod === 'Stripe' ? '#000000' : '#D4AF37'} />
                <Text style={[styles.methodChoiceText, withdrawMethod === 'Stripe' && styles.methodChoiceTextActive]}>
                  Transferencia
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount input */}
            <Text style={styles.fieldLabel}>Monto a Retirar (USD)</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.textInput}
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={COLORS.muted}
              />
            </View>

            {/* Destination account input */}
            <Text style={styles.fieldLabel}>
              {withdrawMethod === 'Binance Pay' ? 'Binance Pay ID o Correo' : 'Número de Cuenta Bancaria / IBAN'}
            </Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.textInputFull}
                value={withdrawAccount}
                onChangeText={setWithdrawAccount}
                placeholder={withdrawMethod === 'Binance Pay' ? 'ej. 84920194 o usuario@binance' : 'ej. Pichincha 2204···'}
                placeholderTextColor={COLORS.muted}
              />
            </View>

            <TouchableOpacity
              style={styles.btnConfirmWithdraw}
              onPress={handleConfirmWithdrawal}
              activeOpacity={0.85}
            >
              <Text style={styles.btnConfirmWithdrawText}>Confirmar y Enviar Solicitud</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

  // Hero Card
  heroCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: '#111111',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
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
    letterSpacing: 0.6,
  },
  heroLabel: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    marginTop: 6,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginVertical: 4,
  },
  heroCurrency: {
    fontSize: FONT.size.md,
    color: '#D4AF37',
    fontWeight: FONT.weight.semibold,
  },
  heroSubText: {
    fontSize: 11,
    color: COLORS.subtext,
    marginBottom: 14,
  },
  btnWithdraw: {
    backgroundColor: '#D4AF37',
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWithdrawText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: '#000000',
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.subtext,
  },
  statVal: {
    fontSize: 15,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginVertical: 3,
  },
  statSub: {
    fontSize: 9,
    color: COLORS.muted,
  },

  // Tab switcher
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.sm - 2,
  },
  tabButtonActive: {
    backgroundColor: '#222222',
  },
  tabText: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: FONT.weight.medium,
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: FONT.weight.bold,
  },

  section: {
    paddingHorizontal: SPACING.md,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: FONT.weight.semibold,
    color: COLORS.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  cardList: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: SPACING.md,
  },

  // Withdrawal Row
  withdrawalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  methodIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawalMethod: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  withdrawalAccount: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 2,
  },
  withdrawalDate: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },
  withdrawalAmount: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusAprobado: {
    backgroundColor: 'rgba(74,222,128,0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(74,222,128,0.3)',
  },
  statusPendiente: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(212,175,55,0.4)',
  },
  statusRechazado: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: FONT.weight.bold,
  },
  statusTextAprobado: {
    color: '#4ADE80',
  },
  statusTextPendiente: {
    color: '#D4AF37',
  },
  statusTextRechazado: {
    color: '#EF4444',
  },

  // Stream Row
  streamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: SPACING.md,
  },
  streamIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streamTitle: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    color: COLORS.white,
  },
  streamSub: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 2,
  },
  streamAmount: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: '#D4AF37',
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    backgroundColor: '#141414',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  modalNotice: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 11,
    color: COLORS.subtext,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  methodChoiceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  methodChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  methodChoiceActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  methodChoiceText: {
    fontSize: 12,
    fontWeight: FONT.weight.semibold,
    color: COLORS.white,
  },
  methodChoiceTextActive: {
    color: '#000000',
    fontWeight: FONT.weight.bold,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: FONT.weight.bold,
    color: '#D4AF37',
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  textInputFull: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.white,
  },
  btnConfirmWithdraw: {
    backgroundColor: '#D4AF37',
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  btnConfirmWithdrawText: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.bold,
    color: '#000000',
  },
});
