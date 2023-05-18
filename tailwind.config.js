/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				gitcol: {
					0: '#f0f6fc',
					100: '#c9d1d9',
					200: '#b1bac4',
					300: '#9B9C9E',
					400: '#6e7681',
					500: '#484f58',
					600: '#30363d',
					700: '#7e90a1',
					800: '#0D0F10',
					900: '#131619',
					border: '#FFFFFF1a'
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif']
			}
		}
	},
	plugins: []
};
