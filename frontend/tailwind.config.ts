import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 60% — dominant background (deep navy/slate)
        surface: {
          DEFAULT: '#0F172A',
          // 30% — secondary background (cards, navbar, review containers)
          raised: '#1E293B',
          muted: '#334155',
          ring: '#475569',
        },
        // 10% — accent (CTAs, active states, key highlights)
        accent: {
          DEFAULT: '#10B981',
          cyan: '#06B6D4',
          600: '#059669',
          700: '#047857',
        },
        // Text colors
        ink: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
          dim: '#64748B',
        },
        // Color-coded rating
        rating: {
          low: '#F97316',
          mid: '#EAB308',
          high: '#10B981',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 10px 40px -10px rgba(16, 185, 129, 0.45)',
        'glow-cyan': '0 10px 40px -10px rgba(6, 182, 212, 0.45)',
        card: '0 12px 30px -12px rgba(0, 0, 0, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'lift-in': 'liftIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        liftIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
