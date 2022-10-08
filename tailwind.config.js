// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/client/**/*.{jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'button-default': colors.white,
        'button-primary': '#3f51b5',
        'button-secondary': '#ff4081',
        'footer-primary': '#312e81',
        'html-primary': '#312e81',
        'toolbar-primary': '#312e81',
      },
      borderWidth: {
        'button-default': '1px',
      },
      height: {
        120: '28rem',
      },
      textColor: {
        'button-default': '#334155',
        'button-primary': '#ececec',
        'button-secondary': '#ececec',
        'content-link': '#6365f1',
        'content-primary': '#334155',
        'content-secondary': '#9ca3af',
        'footer-link': '#c7d2fe',
        'footer-primary': '#f9fafb',
        'toolbar-primary': '#f9fafb',
      },
    },
    container: {
      center: true,
      screens: {
        '2xl': '1280px',
      },
    },
  },
  plugins: [],
};
