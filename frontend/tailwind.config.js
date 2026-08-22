/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#0A0E1A',
          surface: '#0F1629',
          surface2: '#131D36',
          border: '#1E2D4A',
          accent: '#6366F1',
          accent2: '#818CF8',
          sky: '#0EA5E9',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B',
          violet: '#8B5CF6',
          text: '#E8EDFF',
          muted: '#94A3B8',
          faint: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in-left': 'slideInLeft 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s infinite',
        'mesh': 'meshMove 12s ease-in-out infinite',
        'count-up': 'countUp 0.6s ease forwards',
        'dot-pulse': 'dotPulse 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(99, 102, 241, 0)' },
        },
        meshMove: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-20px, 30px) scale(1.05)' },
          '66%': { transform: 'translate(20px, -15px) scale(0.97)' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        dotPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.85)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #0EA5E9 100%)',
        'gradient-indigo': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        'gradient-surface': 'linear-gradient(135deg, #0F1629 0%, #131D36 100%)',
      },
      boxShadow: {
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1)',
        'glow-indigo-sm': '0 0 10px rgba(99, 102, 241, 0.2)',
        'glow-emerald-sm': '0 0 10px rgba(16, 185, 129, 0.25)',
        'glow-rose-sm': '0 0 10px rgba(244, 63, 94, 0.25)',
      },
    },
  },
  plugins: [],
};
