module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'neon': '#0f0',
        'dark-bg': '#050505',
        'dim': '#003300'
      },
      fontFamily: {
        'mono': ['"VT323"', 'monospace']
      },
      animation: {
        'blink': 'blink 1s steps(2, start) infinite'
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } }
      }
    },
  },
  plugins: [],
}