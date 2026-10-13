import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleAuth = () => router.replace('/onboarding');

  return (
    <View style={styles.container}>
      {/* Background accent blobs */}
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      {/* Logo area */}
      <View style={styles.logoArea}>
        {/* Wordmark */}
        <View style={styles.wordmark}>
          <Text style={styles.logoLetterC}>C</Text>
          <Text style={styles.logoText}>lear</Text>
          <Text style={styles.logoLetterM}>M</Text>
          <Text style={styles.logoText}>inds</Text>
        </View>
        <Text style={styles.tagline}>Crea. Crece. Cobra.</Text>
        <Text style={styles.subtitle}>
          La plataforma de creadores{'\n'}hecha para LATAM
        </Text>
      </View>

      {/* Auth buttons */}
      <View style={styles.authArea}>
        <TouchableOpacity style={styles.btnGoogle} onPress={handleAuth} activeOpacity={0.8}>
          <Text style={styles.btnIcon}>G</Text>
          <Text style={styles.btnTextDark}>Continuar con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnApple} onPress={handleAuth} activeOpacity={0.8}>
          <Text style={styles.btnIconLight}></Text>
          <Text style={styles.btnTextLight}>Continuar con Apple</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.btnEmail} onPress={handleAuth} activeOpacity={0.8}>
          <Text style={styles.btnTextMuted}>Usar correo electrónico</Text>
        </TouchableOpacity>

        <Text style={styles.legalText}>
          Al continuar, aceptas los{' '}
          <Text style={styles.legalLink}>Términos de servicio</Text>
          {' '}y la{' '}
          <Text style={styles.legalLink}>Política de privacidad</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  blobTop: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.primary,
    opacity: 0.15,
  },
  blobBottom: {
    position: 'absolute',
    bottom: height * 0.25,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.accent,
    opacity: 0.08,
  },

  // Logo
  logoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.md,
  },
  logoLetterC: {
    fontSize: 52,
    fontWeight: FONT.weight.black,
    color: COLORS.primary,
    letterSpacing: -1,
  },
  logoLetterM: {
    fontSize: 52,
    fontWeight: FONT.weight.black,
    color: COLORS.accent,
    letterSpacing: -1,
  },
  logoText: {
    fontSize: 52,
    fontWeight: FONT.weight.black,
    color: COLORS.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: FONT.size.xl,
    fontWeight: FONT.weight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: FONT.size.md,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Auth
  authArea: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    gap: SPACING.sm,
  },
  btnApple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnEmail: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  btnIcon: {
    fontSize: 17,
    fontWeight: FONT.weight.bold,
    color: '#DB4437',
  },
  btnIconLight: {
    fontSize: 17,
    fontWeight: FONT.weight.bold,
    color: COLORS.white,
  },
  btnTextDark: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.semibold,
    color: '#1A1A1A',
  },
  btnTextLight: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.semibold,
    color: COLORS.white,
  },
  btnTextMuted: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.medium,
    color: COLORS.subtext,
    textDecorationLine: 'underline',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginVertical: SPACING.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: FONT.size.sm,
    color: COLORS.muted,
  },
  legalText: {
    fontSize: FONT.size.xs,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: SPACING.sm,
  },
  legalLink: {
    color: COLORS.subtext,
    textDecorationLine: 'underline',
  },
});
