module.exports = {
  content: [
    './index.html',
    './ts/**/*.ts'
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      colors: {
        navy: '#09101E',
        'light-navy': '#171717',
        'lightest-navy': '#242424',
        slate: '#a7adb7',
        'light-slate': '#d7dce4',
        'lightest-slate': '#f8fafc',
        white: '#ffffff',
        green: '#ffb0be',
        violet: '#ff637e',
        cyan: '#FF637E',
        'green-tint': 'rgba(255, 99, 126, 0.12)'
      }
    }
  },
  plugins: []
};
