import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2F3D4F',
          'primary-dark': '#1E2A38',
          secondary: '#5A7D9A',
          accent: '#7BA3C2',
          bg: '#FFFFFF',
          'bg-secondary': '#F5F7FA',
          border: '#E2E8F0',
          'border-light': '#EDF2F7',
          error: '#FF4040',
          success: '#48BB78',
          focus: '#116DFF',
        },
        text: {
          primary: '#080808',
          secondary: '#4A5568',
          muted: '#718096',
        },
      },
      fontFamily: {
        heading: ["'Playfair Display'", 'Georgia', "'Times New Roman'", 'serif'],
        body: ["'Helvetica Neue'", 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        pill: '9999px',
        btn: '24px',
        result: '16px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
        medium: '0 4px 12px rgba(0, 0, 0, 0.1)',
        result: '0 4px 12px rgba(0, 0, 0, 0.08)',
        button: '0 4px 12px rgba(47, 61, 79, 0.2)',
      },
      maxWidth: {
        quiz: '800px',
      },
      keyframes: {
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-left': {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(-100%)', opacity: '0' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 300ms ease forwards',
        'slide-out-left': 'slide-out-left 300ms ease forwards',
        'slide-in-left': 'slide-in-left 300ms ease forwards',
        'fade-in': 'fade-in 400ms ease forwards',
        'pulse-dot': 'pulse-dot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
