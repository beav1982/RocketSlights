/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* slate-400 with opacity */
        input: "var(--color-input)", /* indigo-900 */
        ring: "var(--color-ring)", /* violet-600 */
        background: "var(--color-background)", /* deep-navy */
        foreground: "var(--color-foreground)", /* slate-50 */
        primary: {
          DEFAULT: "var(--color-primary)", /* violet-600 */
          foreground: "var(--color-primary-foreground)", /* slate-50 */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* orange-500 */
          foreground: "var(--color-secondary-foreground)", /* slate-50 */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* slate-50 */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* indigo-900 */
          foreground: "var(--color-muted-foreground)", /* slate-400 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* cyan-500 */
          foreground: "var(--color-accent-foreground)", /* slate-50 */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* indigo-900 */
          foreground: "var(--color-popover-foreground)", /* slate-50 */
        },
        card: {
          DEFAULT: "var(--color-card)", /* indigo-900 */
          foreground: "var(--color-card-foreground)", /* slate-50 */
        },
        success: {
          DEFAULT: "var(--color-success)", /* emerald-500 */
          foreground: "var(--color-success-foreground)", /* slate-50 */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-500 */
          foreground: "var(--color-warning-foreground)", /* deep-navy */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* slate-50 */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      boxShadow: {
        'game-card': '0 4px 6px -1px rgba(124, 58, 237, 0.1), 0 2px 4px -1px rgba(124, 58, 237, 0.06)',
        'game-card-hover': '0 10px 15px -3px rgba(124, 58, 237, 0.1), 0 4px 6px -2px rgba(124, 58, 237, 0.05)',
        'game-modal': '0 25px 50px -12px rgba(124, 58, 237, 0.25)',
        'connection-status': '0 0 0 1px rgba(124, 58, 237, 0.1), 0 0 20px rgba(124, 58, 237, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spring-scale': 'spring-scale 150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'typing-dots': 'typing-dots 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(124, 58, 237, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)',
          },
        },
        'spring-scale': {
          '0%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(0.98)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        'typing-dots': {
          '0%, 20%': {
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}