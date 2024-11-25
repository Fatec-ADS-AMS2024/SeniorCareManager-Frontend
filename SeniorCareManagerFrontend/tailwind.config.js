/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        /* Cores Base do Sistema */
        neutralLighter: 'var(--color-neutral-lighter)',
        neutral: 'var(--color-neutral)',
        neutralDarker: 'var(--color-neutral-darker)',
        neutralDark: 'var(--color-neutral-dark)',
        background: 'var(--color-background)',
        neutralWhite: 'var( --color-neutral-white)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',

        /* Cores Específicas do Módulo */
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        surfaceUser: 'var(--color-surface-user)',
        hoverButton: 'var(--color-hoverButton)',

        /* Cores Especiais */
        danger: 'var(--color-danger)',
        hoverDanger: 'var(--color-hoverDanger)',

        edit: 'var(--color-edit)',
        hoverEdit: 'var(--color-hoverEdit)',

        success: 'var(--color-success)',
        hoverSuccess: 'var(--color-hoverSuccess)',
        
        warning: 'var(--color-warning)',
      }
    },
  },
  plugins: [],
}

