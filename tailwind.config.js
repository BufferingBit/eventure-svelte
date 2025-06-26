export const theme = {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#3474ff',
        foreground: '#ffffff'
      },
      secondary: {
        DEFAULT: '#8b8db9',
        foreground: '#f8f8ff'
      },
      background: '#f8f8ff',
      muted: '#e6f4f1',
      card: '#ffffff',
      border: '#e2e8f0'
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif']
    },
    animation: {
      'card-hover': 'card-hover 0.2s ease-in-out forwards'
    },
    keyframes: {
      'card-hover': {
        '0%': { transform: 'translateY(0)' },
        '100%': { transform: 'translateY(-4px)' }
      }
    }
  }
};

