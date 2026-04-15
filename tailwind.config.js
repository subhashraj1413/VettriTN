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

          // ── Status ──────────────────────────────────────────────────
          success:          '#2E7D32',
          'success-light':  '#E8F5E9',
          warning:          '#E65100',
          'warning-light':  '#FFF3E0',
          error:            '#B71C1C',
          'error-light':    '#FFEBEE',
          info:             '#1565C0',
          'info-light':     '#E3F2FD',
          purple:           '#4527A0',
          'purple-light':   '#EDE7F6',

          // ── Neutrals ────────────────────────────────────────────────
          background:       '#F2F4F8',
          surface:          '#FFFFFF',
          'surface-alt':    '#F7F9FC',
          border:           '#DDE3EA',
          'border-light':   '#E9EEF5',
          divider:          '#E6EBF2',

          // ── Text ────────────────────────────────────────────────────
          'text-primary':   '#1A1A1A',
          'text-secondary': '#576172',
          'text-tertiary':  '#7F8895',
          'text-inverse':   '#FFFFFF',
          'text-on-yellow': '#5D4500',

          // ── Legacy shorthand (keep for backward compat) ──────────────
          gold:   '#F5C518',
          amber:  '#C9A000',
          blush:  '#FBE8E8',
          cream:  '#FFF8E1',
          paper:  '#F4F6FA',
          mist:   '#FFF1F4',
          ink:    '#1A1A1A',
          muted:  '#5D6776',
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
