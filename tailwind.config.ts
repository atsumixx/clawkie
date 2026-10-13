import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#ECEEF2',
        ink: '#121316',
        slate: '#636874',
        hi: '#FFFFFF',
        shade: '#D1D5DE',
        deep: '#BAC0CD',
        danger: '#ba1a1a',
        'danger-soft': '#ffdad6',
      },
      borderRadius: { DEFAULT: '1rem', lg: '2rem', xl: '3rem', full: '9999px' },
      spacing: { gutter: '1rem', 'gutter-desktop': '2rem', 'space-xs': '0.25rem', 'space-sm': '0.5rem', 'space-md': '1rem', 'space-lg': '1.5rem', 'space-xl': '2.5rem' },
      fontFamily: {
        display: ['var(--font-space)', 'system-ui', 'sans-serif'],
        body: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'label-sm': ['10px', { lineHeight: '12px', letterSpacing: '0.08em', fontWeight: '700' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.06em', fontWeight: '600' }],
        'label-lg': ['14px', { lineHeight: '18px', letterSpacing: '0.04em', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '500' }],
        'headline-md': ['22px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '500' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-lg-mobile': ['32px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-lg': ['48px', { lineHeight: '54px', letterSpacing: '-0.03em', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        'body-md': ['14px', { lineHeight: '20px' }],
        'body-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
      },
      boxShadow: {
        'neo-raised': '6px 6px 14px #D1D5DE, -6px -6px 14px #FFFFFF',
        'neo-float': '12px 12px 24px #BAC0CD, -12px -12px 24px #FFFFFF',
        'neo-inset': 'inset 4px 4px 8px #BAC0CD, inset -4px -4px 8px #FFFFFF',
        'neo-pill': '3px 3px 6px #D1D5DE, -3px -3px 6px #FFFFFF',
        'neo-pill-inset': 'inset 3px 3px 6px #BAC0CD, inset -3px -3px 6px #FFFFFF',
        'neo-btn': '4px 4px 10px #D1D5DE, -4px -4px 10px #FFFFFF',
        'neo-ink': '4px 6px 16px rgba(18, 19, 22, 0.25)',
      },
    },
  },
  plugins: [],
}
export default config
