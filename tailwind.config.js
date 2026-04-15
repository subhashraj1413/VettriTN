/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        tvk: {
          red: '#9F0000',
          maroon: '#8B0000',
          gold: '#F5C518',
          amber: '#C9A000',
          blush: '#FBE8E8',
          cream: '#FFF8E1',
          paper: '#F4F6FA',
          mist: '#FFF1F4',
          ink: '#1A1A1A',
          muted: '#5D6776',
          border: '#DDE3EA',
          success: '#2E7D32',
          info: '#1565C0',
          warning: '#E65100',
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
