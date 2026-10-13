export const COLORS = {
  // Base
  black:   '#000000',
  bg:      '#0A0A0A',
  surface: '#111111',
  card:    '#1A1A1A',
  border:  '#2A2A2A',

  // Brand
  primary:  '#FE2C55',
  accent:   '#25F4EE',
  gold:     '#FFD700',
  goldDark: '#CC9900',

  // Text
  white:   '#FFFFFF',
  text:    '#F5F5F5',
  subtext: '#888888',
  muted:   '#555555',

  // Feedback
  success: '#22C55E',
  error:   '#EF4444',
  warning: '#F59E0B',

  // Gradient pairs
  gradients: {
    primary:  ['#FE2C55', '#FF6B35'] as [string, string],
    accent:   ['#25F4EE', '#0099CC'] as [string, string],
    gold:     ['#FFD700', '#FF8C00'] as [string, string],
    purple:   ['#A855F7', '#6B21A8'] as [string, string],
    green:    ['#10B981', '#059669'] as [string, string],
    blue:     ['#3B82F6', '#1D4ED8'] as [string, string],
  },
} as const;
