import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING, RADIUS } from '@/constants/layout';

type Props = {
  label: string;
  current: number;
  total: number;
  color?: string;
  animate?: boolean;
};

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

export function ProgressBar({ label, current, total, color = COLORS.primary, animate = false }: Props) {
  const pct = Math.min(current / total, 1);
  const anim = useRef(new Animated.Value(animate ? 0 : pct)).current;

  useEffect(() => {
    if (animate) {
      Animated.timing(anim, {
        toValue: pct,
        duration: 1400,
        useNativeDriver: false,
      }).start();
    } else {
      anim.setValue(pct);
    }
  }, [pct, animate]);

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const displayPct = Math.round(pct * 100);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          <Text style={[styles.current, { color }]}>{formatNum(current)}</Text>
          <Text style={styles.separator}> / </Text>
          <Text style={styles.total}>{formatNum(total)}</Text>
          <Text style={[styles.pct, { color }]}>  {displayPct}%</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SPACING.xs },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    color: COLORS.subtext,
  },
  values: { flexDirection: 'row' },
  current: { fontSize: FONT.size.sm, fontWeight: FONT.weight.bold },
  separator: { fontSize: FONT.size.sm, color: COLORS.muted },
  total: { fontSize: FONT.size.sm, color: COLORS.muted },
  pct: { fontSize: FONT.size.sm, fontWeight: FONT.weight.bold },
  track: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
});
