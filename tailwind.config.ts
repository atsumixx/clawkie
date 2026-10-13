import type { Config } from 'tailwindcss'

// clawkie — flat "sticker & doodle" system taken from the Cookie Cart / Clawsette posts:
// off-white paper, near-black ink, chunky outlines, hard offset shadows, hand-drawn type.
const INK = '#1F1F1F'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F4EF', // paper
        ink: INK,          // cow-spot black
        slate: '#6B6862',  // secondary text (the grey "EACH / BOX OF 6" labels)
        hi: '#FFFFFF',
        shade: '#E4E1DA',
        deep: '#B8B3A9',
        cream: '#FBF4E4',  // Valentine's post background
        berry: '#7B2D3B',  // Valentine's post accent — use sparingly
        danger: '#7B2D3B',
        'danger-soft': '#F3DDE0',
      },
      borderRadius: { DEFAULT: '1rem', lg: '1.75rem', xl: '3rem', full: '9999px' },
      spacing: { gutter: '1rem', 'gutter-desktop': '2rem', 'space-xs': '0.25rem', 'space-sm': '0.5rem', 'space-md': '1rem', 'space-lg': '1.5rem', 'space-xl': '2.5rem' },
      fontFamily: {
        display: ['var(--font-display)', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        hand: ['var(--font-hand)', 'ui-rounded', 'cursive'],
      },
      fontSize: {
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.06em', fontWeight: '600' }],
        'label-md': ['13px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '600' }],
        'label-lg': ['15px', { lineHeight: '18px', letterSpacing: '0.02em', fontWeight: '600' }],
        'headline-sm': ['19px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '600' }],
        'headline-md': ['23px', { lineHeight: '28px', letterSpacing: '0em', fontWeight: '600' }],
        'headline-lg-mobile': ['26px', { lineHeight: '32px', letterSpacing: '0em', fontWeight: '600' }],
        'headline-lg': ['34px', { lineHeight: '40px', letterSpacing: '0em', fontWeight: '600' }],
        'display-lg-mobile': ['36px', { lineHeight: '42px', letterSpacing: '0em', fontWeight: '700' }],
        'display-lg': ['54px', { lineHeight: '60px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'body-lg': ['17px', { lineHeight: '25px' }],
        'body-md': ['15px', { lineHeight: '22px' }],
        'body-sm': ['13px', { lineHeight: '18px' }],
      },
      // Same token names as before, so no component has to change.
      // Ring (0 0 0 2px) = the outline, second layer = hard offset "sticker" shadow.
      boxShadow: {
        'neo-raised': `0 0 0 2px ${INK}, 5px 5px 0 2px ${INK}`,
        'neo-float': `0 0 0 2px ${INK}, 8px 8px 0 2px ${INK}`,
        'neo-inset': `0 0 0 2px ${INK}, inset 3px 3px 0 #E4E1DA`,
        'neo-pill': `0 0 0 1.5px ${INK}, 2px 2px 0 1.5px ${INK}`,
        'neo-pill-inset': `0 0 0 1.5px ${INK}, inset 2px 2px 0 #E4E1DA`,
        'neo-btn': `0 0 0 2px ${INK}, 3px 3px 0 2px ${INK}`,
        'neo-press': `0 0 0 2px ${INK}, 0 0 0 2px ${INK}`,
        'neo-ink': `0 0 0 2px ${INK}, 4px 4px 0 2px #8B8780`,
      },
    },
  },
  plugins: [],
}
export default config
