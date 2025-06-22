export const theme = {
	extend: {
		colors: {
			primary: {
				DEFAULT: '#6366f1', // Indigo
				foreground: '#e0e7ff'
			},
			secondary: {
				DEFAULT: '#f43f5e', // Rose
				foreground: '#fff1f2'
			}
		},
		animation: {
			'card-hover': 'card-hover 0.2s ease-in-out forwards'
		},
		keyframes: {
			'card-hover': {
				'0%': { transform: 'translateY(0)' },
				'100%': { transform: 'translateY(-4px)' }
			}
		},
		fontFamily: {
			sans: ['Poppins', 'sans-serif']
		}
	}
};
