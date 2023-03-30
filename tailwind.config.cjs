/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/flowbite-react/**/*.js',
	],
	theme: {
		extend: {
			minWidth: {
				sidebar: '16rem',
				20: '5rem',
			},
		},
	},
	plugins: [require('flowbite/plugin'), require('daisyui')],
	daisyui: {
		themes: ['dark', 'light'],
	},
};
