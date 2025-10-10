module.exports = {
  content: [
    './index.html',
    './ts/**/*.ts',
    './dist/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['SF Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      colors: {
        'navy': '#0a192f',
        'light-navy': '#112240',
        'lightest-navy': '#233554',
        'slate': '#8892b0',
        'light-slate': '#a8b2d1',
        'lightest-slate': '#ccd6f6',
        'white': '#e6f1ff',
        'green': '#64ffda',
        'green-tint': 'rgba(100,255,218,0.1)'
      }
    }
  },
  plugins: []
};
