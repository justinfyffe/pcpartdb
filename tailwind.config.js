// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/web/**/*.{jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'button-default': colors.white,
      },
      borderWidth: {
        'button-default': '1px',
      },
      height: {
        120: '28rem',
      },
      textColor: {
        'button-toolbar': '#ececec',
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
