/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        tvk: {
          red: '#C41E3A',
          maroon: '#8B0000',
          gold: '#F5C518',
          amber: '#C9A000',
          blush: '#FFE8EC',
          cream: '#FFF8E1',
          paper: '#FFFDF8',
          mist: '#FFF4F6',
          ink: '#1A1A1A',
          muted: '#6B6570',
          border: '#ECD9DE',
          success: '#2E7D32',
          info: '#1565C0',
          warning: '#E65100',
        },
      },
      boxShadow: {
        card: '0 10px 28px rgba(139, 0, 0, 0.10)',
        soft: '0 6px 18px rgba(196, 30, 58, 0.12)',
      },
      borderRadius: {
        panel: '8px',
      },
    },
  },
  plugins: [],
};
