/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        navy: {
          800: '#1e3a8a',
          900: '#0f172a',
          950: '#0b1329',
        },
        audit: {
          blue: '#1d4ed8',
          lightBlue: '#eff6ff',
          green: '#059669',
          lightGreen: '#ecfdf5',
          amber: '#d97706',
          lightAmber: '#fffbeb',
          orange: '#ea580c',
          lightOrange: '#fff7ed',
          red: '#dc2626',
          lightRed: '#fef2f2',
          purple: '#7c3aed',
          lightPurple: '#f5f3ff',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': '0.6875rem',
      }
    },
  },
  plugins: [],
}
