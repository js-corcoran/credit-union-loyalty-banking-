/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tier: {
          classic: '#6B7280',
          plus: '#D4A574',
          premium: '#E8E8E8',
        },
        semantic: {
          success: '#10B981',
          warning: '#F59E0B',
          urgent: '#EF4444',
          neutral: '#F3F4F6',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
        },
      },
      fontSize: {
        body: '16px',
        h1: '28px',
        h2: '24px',
        h3: '20px',
        small: '14px',
      },
      spacing: {
        micro: '8px',
        sm: '12px',
        base: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
      },
      maxWidth: {
        container: '900px',
      },
      minHeight: {
        touch: '48px',
      },
      minWidth: {
        touch: '48px',
      },
    },
  },
  plugins: [],
}
