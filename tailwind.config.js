/** @type {import('tailwindcss').Config} */
export const darkMode = ['class']
export const content = [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
]
export const prefix = ''
export const theme = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px',
    },
  },
  extend: {
    colors: {
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
    },

    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
      'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
      'slide': 'slide var(--speed) ease-in-out infinite alternate',
      'orbit': 'orbit calc(var(--duration)*1s) linear infinite',
      'shimmer': 'shimmer 8s infinite',
      'ripple': 'ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite',
    },

    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
      'orbit': {
        '0%': {
          transform: 'rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)',
        },
        '100%': {
          transform: 'rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)',
        },
      },
      'spin-around': {
        '0%': {
          transform: 'translateZ(0) rotate(0)',
        },
        '15%, 35%': {
          transform: 'translateZ(0) rotate(90deg)',
        },
        '65%, 85%': {
          transform: 'translateZ(0) rotate(270deg)',
        },
        '100%': {
          transform: 'translateZ(0) rotate(360deg)',
        },
      },
      'slide': {
        to: {
          transform: 'translate(calc(100cqw - 100%), 0)',
        },
      },
      'shimmer': {
        '0%, 90%, 100%': {
          'background-position': 'calc(-100% - var(--shimmer-width)) 0',
        },
        '30%, 60%': {
          'background-position': 'calc(100% + var(--shimmer-width)) 0',
        },
      },
      'shine-pulse': {
        '0%': {
          'background-position': '0% 0%',
        },
        '50%': {
          'background-position': '100% 100%',
        },
        'to': {
          'background-position': '0% 0%',
        },
      },
      'ripple': {
        '0%, 100%': {
          transform: 'translate(-50%, -50%) scale(1)',
        },
        '50%': {
          transform: 'translate(-50%, -50%) scale(0.9)',
        },
      },
    },
  },
}
export const plugins = [import('tailwindcss-animate')]
