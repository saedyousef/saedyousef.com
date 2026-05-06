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
        navy: '#050816',
        'light-navy': '#0f172a',
        'lightest-navy': '#1e293b',
        slate: '#94a3b8',
        'light-slate': '#cbd5e1',
        'lightest-slate': '#f8fafc',
        white: '#ffffff',
        green: '#7dd3fc',
        violet: '#a78bfa',
        cyan: '#67e8f9',
        'green-tint': 'rgba(125, 211, 252, 0.12)'
      }
    }
  },
  plugins: []
};
