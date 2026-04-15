// TVK Official Party Colors
// Flag: Maroon-Red (top & bottom) + Golden Yellow (center)

export const TVKColors = {
  // ─── TVK Brand (Party Flag Colors) ───────────────────────────────
  maroon:       '#8B0000',  // Deep maroon — top/bottom of flag
  red:          '#9F0000',  // Primary TVK flag red
  redDark:      '#740000',  // Darker shade
  redLight:     '#FBE8E8',  // Tinted background
  yellow:       '#F5C518',  // Golden yellow — center of flag
  yellowDark:   '#C9A000',  // Darker yellow for text
  yellowLight:  '#FFF6D9',  // Yellow tinted background

  // ─── App UI Semantic Colors ───────────────────────────────────────
  primary:      '#9F0000',  // TVK Red → main CTAs, headers
  primaryDark:  '#740000',  // Pressed states, deep accents
  primaryLight: '#FBE8E8',  // Card backgrounds, chips

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
  background:   '#F2F4F8',
  surface:      '#FFFFFF',
  surfaceAlt:   '#F7F9FC',
  border:       '#DDE3EA',
  borderLight:  '#E9EEF5',
  divider:      '#E6EBF2',

  // ─── Text ────────────────────────────────────────────────────────
  textPrimary:   '#7F8895',
  textSecondary: '#576172',
  textTertiary:  '#7F8895',
  textInverse:   '#FFFFFF',
  textOnYellow:  '#5D4500',  // Readable text on TVK yellow bg
  textOnRed:     '#FFFFFF',  // Text on TVK red

  // ─── Splash / Launch Screen ───────────────────────────────────────
  splashBg:     '#9F0000',  // TVK Red background
  splashAccent: '#F5C518',  // TVK Yellow elements
};

export type ColorKey = keyof typeof TVKColors;
