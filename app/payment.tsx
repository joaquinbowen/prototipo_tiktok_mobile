import { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { useMonetization } from '@/context/MonetizationContext';

type Tab = 'card' | 'crypto';
type Stage = 'form' | 'loading' | 'success';

function CardForm({ onPay }: { onPay: () => void }) {
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  function formatCard(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }
  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  const isValid = cardNum.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length === 3;

  return (
    <View style={styles.form}>
      <Text style={styles.fieldLabel}>Número de tarjeta</Text>
      <View style={styles.fieldWrap}>
        <Text style={styles.fieldIcon}>💳</Text>
        <TextInput
          style={styles.fieldInput}
          value={cardNum}
          onChangeText={v => setCardNum(formatCard(v))}
          placeholder="0000 0000 0000 0000"
          placeholderTextColor={COLORS.muted}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.fieldRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>Vencimiento</Text>
          <View style={styles.fieldWrap}>
            <TextInput
              style={[styles.fieldInput, { paddingLeft: SPACING.md }]}
              value={expiry}
              onChangeText={v => setExpiry(formatExpiry(v))}
              placeholder="MM/AA"
              placeholderTextColor={COLORS.muted}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>CVV</Text>
          <View style={styles.fieldWrap}>
            <TextInput
              style={[styles.fieldInput, { paddingLeft: SPACING.md }]}
              value={cvv}
              onChangeText={v => setCvv(v.replace(/\D/g, '').slice(0, 3))}
              placeholder="•••"
              placeholderTextColor={COLORS.muted}
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.payBtn, !isValid && styles.payBtnDisabled]}
        onPress={onPay}
        disabled={!isValid}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={isValid ? [COLORS.primary, '#CC0033'] : [COLORS.surface, COLORS.surface]}
          style={styles.payBtnGradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.payBtnText, !isValid && styles.payBtnTextDisabled]}>
            Pagar $9.99/mes
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.securityRow}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>Pago seguro con Stripe · SSL encriptado</Text>
      </View>
    </View>
  );
}

function CryptoForm({ onPay }: { onPay: () => void }) {
  return (
    <View style={styles.form}>
      <Text style={styles.cryptoHint}>Escanea el código QR con Binance Pay</Text>

      {/* Simulated QR code */}
      <View style={styles.qrWrapper}>
        <View style={styles.qrBox}>
          {/* QR pattern simulation */}
          <View style={styles.qrGrid}>
            {Array.from({ length: 49 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.qrCell,
                  // Corner markers + random inner pattern
                  (i < 7 || (i >= 14 && i < 21 && i % 7 < 3) ||
                    (i >= 42) || Math.random() > 0.55) && styles.qrCellFilled,
                ]}
              />
            ))}
          </View>
          <View style={styles.qrLogo}>
            <Text style={styles.qrLogoText}>₿</Text>
          </View>
        </View>
        <Text style={styles.qrAmount}>$9.99 USDT</Text>
        <Text style={styles.qrExpiry}>Expira en 10:00 min</Text>
      </View>

      <TouchableOpacity style={styles.payBtn} onPress={onPay} activeOpacity={0.85}>
        <LinearGradient
          colors={[COLORS.gold, '#FF8C00']}
          style={styles.payBtnGradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.payBtnText, { color: COLORS.black }]}>
            ✓ Ya realicé el pago
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.securityRow}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>Verificado por Binance Pay · USDT / BNB</Text>
      </View>
    </View>
  );
}

function SuccessView({ method, onContinue }: { method: Tab; onContinue: () => void }) {
  return (
    <View style={styles.successView}>
      <ConfettiEffect />
      <View style={styles.successIcon}>
        <Text style={styles.successEmoji}>✅</Text>
      </View>
      <Text style={styles.successTitle}>
        {method === 'card' ? 'Pago Exitoso' : 'Pago Crypto Confirmado'}
      </Text>
      <Text style={styles.successSubtitle}>
        {method === 'card'
          ? 'Tu suscripción de $9.99/mes está activa.'
          : 'Tu pago en USDT fue verificado por Binance Pay.'}
      </Text>
      <Text style={styles.successSub2}>
        Bienvenido al programa de creadores de Viraly 🎉
      </Text>
      <TouchableOpacity style={styles.continueBtn} onPress={onContinue} activeOpacity={0.85}>
        <LinearGradient
          colors={[COLORS.gold, '#FF8C00']}
          style={styles.payBtnGradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.payBtnText, { color: COLORS.black }]}>
            Ver mis Ganancias →
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function PaymentScreen() {
  const [tab, setTab] = useState<Tab>('card');
  const [stage, setStage] = useState<Stage>('form');
  const { setPaid } = useMonetization();

  function handlePay() {
    setStage('loading');
    setTimeout(() => {
      setPaid();
      setStage('success');
    }, 2200);
  }

  function handleContinue() {
    router.replace('/wallet');
  }

  if (stage === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <SuccessView method={tab} onContinue={handleContinue} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Activar Monetización</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Price hero */}
        <LinearGradient
          colors={[COLORS.gold + '22', COLORS.primary + '11']}
          style={styles.priceHero}
        >
          <Text style={styles.priceLabel}>Suscripción mensual</Text>
          <Text style={styles.priceAmount}>$9.99</Text>
          <Text style={styles.priceSub}>USD / mes · cancela cuando quieras</Text>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabs}>
          {[
            { key: 'card' as Tab, label: '💳 Tarjeta' },
            { key: 'crypto' as Tab, label: '₿ Crypto' },
          ].map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
              onPress={() => setTab(t.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {stage === 'loading' ? (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>
              {tab === 'card' ? 'Procesando pago...' : 'Verificando transacción...'}
            </Text>
          </View>
        ) : (
          tab === 'card'
            ? <CardForm onPay={handlePay} />
            : <CryptoForm onPay={handlePay} />
        )}
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
    borderBottomColor: COLORS.border,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 28, color: COLORS.white, lineHeight: 32 },
  title: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.white },

  priceHero: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
  },
  priceLabel: { fontSize: FONT.size.sm, color: COLORS.subtext, marginBottom: SPACING.xs },
  priceAmount: {
    fontSize: 52,
    fontWeight: FONT.weight.black,
    color: COLORS.gold,
    lineHeight: 60,
  },
  priceSub: { fontSize: FONT.size.sm, color: COLORS.muted, marginTop: SPACING.xs },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  tabBtnActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.subtext },
  tabTextActive: { color: COLORS.white },

  form: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    gap: SPACING.sm,
  },
  fieldLabel: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    color: COLORS.subtext,
    marginBottom: 4,
  },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  fieldIcon: { fontSize: 18 },
  fieldInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: FONT.size.md,
    color: COLORS.white,
  },
  fieldRow: { flexDirection: 'row', gap: SPACING.sm },

  payBtn: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  payBtnDisabled: { opacity: 0.5 },
  payBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  payBtnText: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.black,
    color: COLORS.white,
  },
  payBtnTextDisabled: { color: COLORS.muted },

  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  securityIcon: { fontSize: 13 },
  securityText: { fontSize: FONT.size.xs, color: COLORS.muted },

  cryptoHint: {
    fontSize: FONT.size.md,
    color: COLORS.subtext,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  qrWrapper: { alignItems: 'center', gap: SPACING.sm },
  qrBox: {
    width: 200, height: 200,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 176, height: 176,
    gap: 0,
  },
  qrCell: {
    width: '14.28%', height: 25,
    backgroundColor: 'transparent',
  },
  qrCellFilled: { backgroundColor: '#1A1A1A' },
  qrLogo: {
    position: 'absolute',
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  qrLogoText: { fontSize: 20, fontWeight: FONT.weight.black },
  qrAmount: { fontSize: FONT.size.xl, fontWeight: FONT.weight.black, color: COLORS.gold },
  qrExpiry: { fontSize: FONT.size.sm, color: COLORS.muted },

  loadingView: {
    paddingVertical: SPACING.xxl * 2,
    alignItems: 'center',
    gap: SPACING.lg,
  },
  loadingText: { fontSize: FONT.size.lg, color: COLORS.subtext },

  successView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  successIcon: {
    width: 96, height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.success + '22',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.success + '44',
  },
  successEmoji: { fontSize: 48 },
  successTitle: {
    fontSize: FONT.size.xxl,
    fontWeight: FONT.weight.black,
    color: COLORS.white,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: FONT.size.md,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  successSub2: {
    fontSize: FONT.size.md,
    color: COLORS.gold,
    textAlign: 'center',
    fontWeight: FONT.weight.semibold,
  },
  continueBtn: {
    width: '100%',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
});
