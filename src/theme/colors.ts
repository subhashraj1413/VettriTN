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

  // ─── Semantic Status Tones (TVK-only palette) ───────────────────
  success:      '#8B0000',  // maroon tone
  successLight: '#FBE8E8',
  warning:      '#C9A000',  // yellow-dark tone
  warningLight: '#FFF6D9',
  error:        '#740000',  // deep red tone
  errorLight:   '#FBE8E8',
  info:         '#9F0000',  // primary red tone
  infoLight:    '#FBE8E8',
  purple:       '#8B0000',  // mapped to maroon to avoid off-palette purple
  purpleLight:  '#FBE8E8',

  // ─── Neutrals ────────────────────────────────────────────────────
  white:        '#FFFFFF',
  black:        '#000000',
  background:   '#F9F4EE',
  surface:      '#FFFFFF',
  surfaceAlt:   '#FEF8F2',
  border:       '#E3D4C5',
  borderLight:  '#EFE4D8',
  divider:      '#E9DDCF',

  // ─── Text ────────────────────────────────────────────────────────
  textPrimary:   '#1A1A1A',
  textSecondary: '#5C4D3C',
  textTertiary:  '#7A6A58',
  textInverse:   '#FFFFFF',
  textOnYellow:  '#5D4500',  // Readable text on TVK yellow bg
  textOnRed:     '#FFFFFF',  // Text on TVK red

  // ─── Splash / Launch Screen ───────────────────────────────────────
  splashBg:     '#9F0000',  // TVK Red background
  splashAccent: '#F5C518',  // TVK Yellow elements
};

export type ColorKey = keyof typeof TVKColors;
