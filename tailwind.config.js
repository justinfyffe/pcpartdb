module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/client/**/*.{jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'alert-error': '#b00020',
        'alert-info': '#f0f0f0',
        'alert-success': '#007e33',
        'button-default': '#ffffff',
        'button-primary': '#3f51b5',
        'button-secondary': '#ff4081',
        card: 'rgb(249,240,251)',
        content: '#ffffff',
        footer: '#312e81',
        html: '#312e81',
        'mouse-hover': '#fafafa',
        toolbar: '#312e81',
      },
      borderWidth: {
        'button-default': '1px',
      },
      height: {
        120: '28rem',
      },
      textColor: {
        'alert-error': '#ffffff',
        'alert-info': '#000000',
        'alert-success': '#ffffff',
        'button-default': '#334155',
        'button-primary': '#ececec',
        'button-secondary': '#ececec',
        card: '#334155',
        content: '#334155',
        'content-link': '#6365f1',
        'content-dimmed': '#9ca3af',
        footer: '#f9fafb',
        'footer-link': '#c7d2fe',
        toolbar: '#f9fafb',
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
