/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48', // Primary Accent (Crimson Red)
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          dark: '#111827',  // Neutral Dark Charcoal (Never pure black)
          body: '#374151',  // Slate Charcoal
          light: '#F9FAFB', // Off-White background
        },
        heritage: {
          zawo: '#F59E0B',    // Ende Diamond Gold / Amber
          zawoDark: '#D97706',
          ocean: '#0284C7',   // Flores Ocean Wave Deep Sky Blue
          oceanDark: '#0369A1',
          crimson: '#E11D48',
          charcoal: '#1E293B',
        },
        promo: {
          emerald: '#10B981',
          emeraldDark: '#059669',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      spacing: {
        // 8-Point Grid alignment helpers
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
        '26': '6.5rem',  // 104px
      },
      boxShadow: {
        'glow-brand': '0 0 20px -5px rgba(225, 29, 72, 0.4)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
