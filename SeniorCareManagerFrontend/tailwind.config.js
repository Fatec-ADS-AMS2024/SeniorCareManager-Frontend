/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        neutralLighter: 'var(--color-neutral-lighter)',
        neutralLight: 'var(--color-neutral-light)',
        neutral: 'var(--color-neutral)',
        neutralDarker: 'var(--color-neutral-darker)',
        neutralDark: 'var(--color-neutral-dark)',
        neutralWhite: 'var( --color-neutral-white)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        surfaceUser: 'var(--color-surface-user)',
        hoverButton: 'var(--color-hoverButton)',
        danger: 'var(--color-danger)',
        hoverDanger: 'var(--color-hoverDanger)',
        edit: 'var(--color-edit)',
        hoverEdit: 'var(--color-hoverEdit)',
        success: 'var(--color-success)',
        hoverSuccess: 'var(--color-hoverSuccess)',
        warning: 'var(--color-warning)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideInUp: 'slideInUp 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}