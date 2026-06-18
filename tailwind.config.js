/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ksp-bg': '#0B1020',
        'ksp-surface': '#111827',
        'ksp-primary': '#3B82F6',
        'ksp-accent': '#06B6D4',
        'ksp-success': '#10B981',
        'ksp-warning': '#F59E0B',
        'ksp-danger': '#EF4444',
        'ksp-muted': '#9CA3AF',
        'ksp-border': 'rgba(59, 130, 246, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.4)',
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'grid-pattern': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KPHBhdGggZD0iTTAgMGg0MHY0MEgwWiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNNCAwaDM2djM2SDRaIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoNTksIDEzMCwgMjQ2LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')",
      }
    },
  },
  plugins: [],
}
