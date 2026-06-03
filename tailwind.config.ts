import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2.5rem',
        xl: '3.5rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        // Signature racing red
        red: {
          DEFAULT: '#E10600',
          50: '#FFF1F0',
          100: '#FFD9D6',
          200: '#FFADA8',
          300: '#FF6B62',
          400: '#FA2D22',
          500: '#E10600',
          600: '#B80500',
          700: '#8F0400',
          800: '#660300',
          900: '#3D0100',
        },
        // Deep blacks
        ink: {
          DEFAULT: '#0A0A0A',
          950: '#050505',
          900: '#0A0A0A',
          850: '#101010',
          800: '#151515',
          750: '#1B1B1B',
          700: '#222222',
        },
        // Metallic silver / graphite
        graphite: {
          DEFAULT: '#9CA0A6',
          100: '#EDEEF0',
          200: '#D6D8DC',
          300: '#B9BCC2',
          400: '#9CA0A6',
          500: '#7C8088',
          600: '#5C5F66',
          700: '#3E4046',
          800: '#2A2B2F',
        },
        chrome: '#C9CDD3',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Oswald', 'Impact', 'sans-serif'],
        anton: ['var(--font-anton)', 'Oswald', 'Impact', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        condensed: '-0.02em',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(225,6,0,0.35), 0 0 24px rgba(225,6,0,0.45)',
        'glow-lg': '0 0 0 1px rgba(225,6,0,0.4), 0 0 48px rgba(225,6,0,0.55)',
        'glow-sm': '0 0 16px rgba(225,6,0,0.35)',
        card: '0 24px 60px -24px rgba(0,0,0,0.85)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'red-sheen':
          'linear-gradient(120deg, #B80500 0%, #E10600 45%, #FA2D22 55%, #B80500 100%)',
        'chrome-sheen':
          'linear-gradient(120deg, #5C5F66 0%, #C9CDD3 45%, #FFFFFF 50%, #C9CDD3 55%, #5C5F66 100%)',
        'ink-fade':
          'radial-gradient(120% 100% at 50% 0%, #151515 0%, #0A0A0A 55%, #050505 100%)',
        'grid-lines':
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'rev-needle': {
          '0%': { transform: 'rotate(-12deg)' },
          '20%': { transform: 'rotate(58deg)' },
          '40%': { transform: 'rotate(34deg)' },
          '70%': { transform: 'rotate(72deg)' },
          '100%': { transform: 'rotate(-12deg)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
        'marquee-reverse': 'marquee-reverse 50s linear infinite',
        shimmer: 'shimmer 3.5s linear infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-circ': 'cubic-bezier(0.85, 0, 0.15, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
