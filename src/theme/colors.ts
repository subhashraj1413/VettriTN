// TVK Official Party Colors
// Flag: Maroon-Red (top & bottom) + Golden Yellow (center)

export const TVKColors = {
  // ─── TVK Brand (Party Flag Colors) ───────────────────────────────
  maroon:       '#8B0000',  // Deep maroon — top/bottom of flag
  red:          '#C41E3A',  // Primary brand red
  redDark:      '#8B0000',  // Darker shade
  redLight:     '#FFE8EC',  // Tinted background
  yellow:       '#F5C518',  // Golden yellow — center of flag
  yellowDark:   '#C9A000',  // Darker yellow for text
  yellowLight:  '#FFF8E1',  // Yellow tinted background

  // ─── App UI Semantic Colors ───────────────────────────────────────
  primary:      '#C41E3A',  // TVK Red → main CTAs, headers
  primaryDark:  '#8B0000',  // Pressed states, deep accents
  primaryLight: '#FFE8EC',  // Card backgrounds, chips

  accent:       '#F5C518',  // TVK Yellow → highlights, badges
  accentDark:   '#C9A000',  // Text on yellow bg
  accentLight:  '#FFF8E1',  // Yellow chip backgrounds

  // ─── Status Colors ───────────────────────────────────────────────
  success:      '#2E7D32',
  successLight: '#E8F5E9',
  warning:      '#E65100',
  warningLight: '#FFF3E0',
  error:        '#B71C1C',
  errorLight:   '#FFEBEE',
  info:         '#1565C0',
  infoLight:    '#E3F2FD',
  purple:       '#4527A0',
  purpleLight:  '#EDE7F6',

  // ─── Neutrals ────────────────────────────────────────────────────
  white:        '#FFFFFF',
  black:        '#000000',
  background:   '#F7F7F7',
  surface:      '#FFFFFF',
  surfaceAlt:   '#F2F2F2',
  border:       '#E8E8E8',
  borderLight:  '#F0F0F0',
  divider:      '#EEEEEE',

  // ─── Text ────────────────────────────────────────────────────────
  textPrimary:   '#1A1A1A',
  textSecondary: '#616161',
  textTertiary:  '#9E9E9E',
  textInverse:   '#FFFFFF',
  textOnYellow:  '#5D4500',  // Readable text on TVK yellow bg
  textOnRed:     '#FFFFFF',  // Text on TVK red

  // ─── Splash / Launch Screen ───────────────────────────────────────
  splashBg:     '#C41E3A',  // TVK Red background
  splashAccent: '#F5C518',  // TVK Yellow elements
};

export type ColorKey = keyof typeof TVKColors;
