/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        tvk: {
          // ── Brand (Party Flag) ──────────────────────────────────────
          maroon:           '#8B0000',
          red:              '#9F0000',
          'red-dark':       '#740000',
          'red-light':      '#FBE8E8',
          yellow:           '#F5C518',
          'yellow-dark':    '#C9A000',
          'yellow-light':   '#FFF6D9',

          // ── Semantic Aliases ────────────────────────────────────────
          primary:          '#9F0000',
          'primary-dark':   '#740000',
          'primary-light':  '#FBE8E8',
          accent:           '#F5C518',
          'accent-dark':    '#C9A000',
          'accent-light':   '#FFF8E1',

          // ── Status (TVK-only semantic tones) ───────────────────────
          success:          '#8B0000',
          'success-light':  '#FBE8E8',
          warning:          '#C9A000',
          'warning-light':  '#FFF6D9',
          error:            '#740000',
          'error-light':    '#FBE8E8',
          info:             '#9F0000',
          'info-light':     '#FBE8E8',
          purple:           '#8B0000',
          'purple-light':   '#FBE8E8',

          // ── Neutrals ────────────────────────────────────────────────
          background:       '#F9F4EE',
          surface:          '#FFFFFF',
          'surface-alt':    '#FEF8F2',
          border:           '#E3D4C5',
          'border-light':   '#EFE4D8',
          divider:          '#E9DDCF',

          // ── Text ────────────────────────────────────────────────────
          'text-primary':   '#1A1A1A',
          'text-secondary': '#5C4D3C',
          'text-tertiary':  '#7A6A58',
          'text-inverse':   '#FFFFFF',
          'text-on-yellow': '#5D4500',

          // ── Legacy shorthand (keep for backward compat) ──────────────
          gold:   '#F5C518',
          amber:  '#C9A000',
          blush:  '#FBE8E8',
          cream:  '#FFF8E1',
          paper:  '#F9F4EE',
          mist:   '#FFF1F4',
          ink:    '#1A1A1A',
          muted:  '#5C4D3C',

          // ── Classic theme surface tokens (TVK Maroon-dominant) ────────
          // Use for className-driven static styling in Classic mode.
          // Dynamic theming (backgrounds, borders) → use inline style via useTheme().
          'classic-bg':        '#F9F4EE',   // warm parchment background
          'classic-card':      '#FEFAF5',   // warm-white card surface
          'classic-border':    '#D8CCBB',   // sandstone border
          'classic-text':      '#1C120A',   // deep warm ink
          'classic-subtext':   '#5C4D3C',   // medium warm brown
          'classic-header':    '#8B0000',   // TVK Maroon header
          'classic-tab':       '#6B0000',   // deep maroon tab rail

          // ── Modern theme surface tokens (TVK Red + Yellow-dominant) ───
          // Use for className-driven static styling in Modern mode.
          'modern-bg':         '#F9F4EE',   // warm neutral background
          'modern-card':       '#FFFFFF',   // clean white card
          'modern-border':     '#E3D4C5',   // warm border
          'modern-text':       '#1A1A1A',   // neutral dark text
          'modern-subtext':    '#5C4D3C',   // warm secondary text
          'modern-header':     '#9F0000',   // vibrant TVK Red header
          'modern-tab':        '#9F0000',   // TVK Red tab rail
          'modern-accent':     '#F5C518',   // TVK Golden Yellow accent
        },
      },
      boxShadow: {
        card: '0 10px 24px rgba(21, 32, 52, 0.12)',
        soft: '0 5px 14px rgba(21, 32, 52, 0.10)',
      },
      borderRadius: {
        panel: '8px',
      },
    },
  },
  plugins: [],
};
