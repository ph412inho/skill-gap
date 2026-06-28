import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sarabun)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        evidence: {
          verified:    '#16a34a',
          partial:     '#ca8a04',
          weak:        '#ea580c',
          unverified:  '#dc2626',
          gap:         '#7c3aed',
          transferable:'#0891b2',
          'low-dur':   '#9ca3af',
        },
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(14,165,233,0.4)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(14,165,233,0)' },
        },
      },
      animation: {
        'fade-in':   'fade-in 0.35s ease-out both',
        'slide-in':  'slide-in 0.3s ease-out both',
        'pulse-ring':'pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
