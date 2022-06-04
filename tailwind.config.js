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
      textColor: {
        'button-toolbar': '#ececec',
      },
    },
  },
  plugins: [],
};
