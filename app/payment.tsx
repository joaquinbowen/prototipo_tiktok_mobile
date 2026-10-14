import { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
        <Ionicons name="card-outline" size={18} color={COLORS.muted} style={{ marginRight: 8 }} />
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
              style={styles.fieldInput}
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
              style={styles.fieldInput}
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
        style={[styles.payBtnSolid, isValid ? styles.payBtnSolidActive : styles.payBtnSolidDisabled]}
        onPress={onPay}
        disabled={!isValid}
        activeOpacity={0.85}
      >
        <Text style={[styles.payBtnText, !isValid && styles.payBtnTextDisabled]}>
          Pagar $9.99/mes
        </Text>
      </TouchableOpacity>

      <View style={styles.securityRow}>
        <Ionicons name="shield-checkmark-outline" size={15} color={COLORS.muted} />
        <Text style={styles.securityText}>Pago seguro con Stripe · SSL 256-bit encriptado</Text>
      </View>
    </View>
  );
}

function CryptoForm({ onPay }: { onPay: () => void }) {
  return (
    <View style={styles.form}>
      <Text style={styles.cryptoHint}>Escanea el código QR desde tu app Binance</Text>

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
                  (i < 7 || (i >= 14 && i < 21 && i % 7 < 3) ||
                    (i >= 42) || Math.random() > 0.55) && styles.qrCellFilled,
                ]}
              />
            ))}
          </View>
          <View style={styles.qrLogo}>
            <Ionicons name="logo-bitcoin" size={16} color="#000000" />
          </View>
        </View>
        <Text style={styles.qrAmount}>$9.99 USDT</Text>
        <Text style={styles.qrExpiry}>Expira en 10:00 min</Text>
      </View>

      <TouchableOpacity style={styles.payBtnCrypto} onPress={onPay} activeOpacity={0.85}>
        <Ionicons name="checkmark" size={18} color="#000000" style={{ marginRight: 6 }} />
        <Text style={styles.payBtnCryptoText}>
          Confirmar Pago Realizado
        </Text>
      </TouchableOpacity>

      <View style={styles.securityRow}>
        <Ionicons name="shield-checkmark-outline" size={15} color={COLORS.muted} />
        <Text style={styles.securityText}>Verificado por Binance Pay · USDT / BNB</Text>
      </View>
    </View>
  );
}

function SuccessView({ method, onContinue }: { method: Tab; onContinue: () => void }) {
  return (
    <View style={styles.successView}>
      <ConfettiEffect />
      <View style={styles.successIconCircle}>
        <Ionicons name="checkmark-circle" size={54} color="#4ADE80" />
      </View>
      <Text style={styles.successTitle}>
        {method === 'card' ? 'Pago Exitoso' : 'Pago Crypto Confirmado'}
      </Text>
      <Text style={styles.successSubtitle}>
        {method === 'card'
          ? 'Tu suscripción mensual de $9.99 USD ha sido activada correctamente.'
          : 'Tu pago en USDT fue verificado por Binance Pay.'}
      </Text>
      <Text style={styles.successSub2}>
        Bienvenido al programa de creadores de Viraly.
      </Text>
      <TouchableOpacity style={styles.continueBtnSolid} onPress={onContinue} activeOpacity={0.85}>
        <Text style={styles.continueBtnText}>
          Continuar a Creator Studio
        </Text>
        <Ionicons name="arrow-forward" size={16} color="#000000" style={{ marginLeft: 6 }} />
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
    }, 1800);
  }

  function handleContinue() {
    router.replace('/creator-studio');
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
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Activar Monetización</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Solid Dark Price hero */}
        <View style={styles.priceHeroSolid}>
          <Text style={styles.priceLabel}>Suscripción mensual de creador</Text>
          <Text style={styles.priceAmount}>$9.99</Text>
          <Text style={styles.priceSub}>USD / mes · cancela cuando quieras sin penalidad</Text>
        </View>

        {/* Tab selection with vector icons */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'card' && styles.tabBtnActive]}
            onPress={() => setTab('card')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="card-outline"
              size={16}
              color={tab === 'card' ? '#000000' : COLORS.subtext}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabText, tab === 'card' && styles.tabTextActive]}>
              Tarjeta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tab === 'crypto' && styles.tabBtnActive]}
            onPress={() => setTab('crypto')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="logo-bitcoin"
              size={16}
              color={tab === 'crypto' ? '#000000' : COLORS.subtext}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabText, tab === 'crypto' && styles.tabTextActive]}>
              Binance Pay
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form area or loading spinner */}
        {stage === 'loading' ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>Procesando pago seguro...</Text>
            <Text style={styles.loadingSub}>Verificando credenciales con la pasarela</Text>
          </View>
        ) : (
          tab === 'card' ? <CardForm onPay={handlePay} /> : <CryptoForm onPay={handlePay} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: { padding: 4 },
  title: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.white },

  priceHeroSolid: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    gap: 4,
  },
  priceLabel: {
    fontSize: FONT.size.xs,
    color: COLORS.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  priceAmount: {
    fontSize: 40,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    letterSpacing: -1,
    marginVertical: 2,
  },
  priceSub: {
    fontSize: 11,
    color: COLORS.subtext,
  },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.sm - 2,
  },
  tabBtnActive: {
    backgroundColor: '#D4AF37',
  },
  tabText: {
    fontSize: 12,
    fontWeight: FONT.weight.semibold,
    color: COLORS.subtext,
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: FONT.weight.bold,
  },

  form: {
    paddingHorizontal: SPACING.md,
    gap: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: FONT.weight.medium,
    color: COLORS.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.white,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 10,
  },

  // Flat solid buttons
  payBtnSolid: {
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  payBtnSolidActive: {
    backgroundColor: '#D4AF37',
  },
  payBtnSolidDisabled: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  payBtnText: {
    fontSize: 14,
    fontWeight: FONT.weight.bold,
    color: '#000000',
  },
  payBtnTextDisabled: {
    color: COLORS.muted,
  },

  payBtnCrypto: {
    backgroundColor: '#D4AF37',
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  payBtnCryptoText: {
    fontSize: 14,
    fontWeight: FONT.weight.bold,
    color: '#000000',
  },

  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 6,
  },
  securityText: {
    fontSize: 11,
    color: COLORS.muted,
  },

  // Crypto
  cryptoHint: {
    fontSize: 12,
    color: COLORS.subtext,
    textAlign: 'center',
  },
  qrWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  qrBox: {
    width: 170,
    height: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrGrid: {
    width: 140,
    height: 140,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  qrCell: {
    width: 18,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#F0F0F0',
  },
  qrCellFilled: {
    backgroundColor: '#000000',
  },
  qrLogo: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrAmount: {
    fontSize: 18,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
    marginTop: 6,
  },
  qrExpiry: {
    fontSize: 11,
    color: COLORS.muted,
  },

  // Loading
  loadingArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  loadingText: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  loadingSub: {
    fontSize: 11,
    color: COLORS.subtext,
  },

  // Success
  successView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: 8,
  },
  successIconCircle: {
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  successSubtitle: {
    fontSize: 13,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
  successSub2: {
    fontSize: 12,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  continueBtnSolid: {
    backgroundColor: '#D4AF37',
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: FONT.weight.bold,
    color: '#000000',
  },
});
