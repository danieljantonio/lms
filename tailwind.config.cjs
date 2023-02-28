/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}', './node_modules/flowbite-react/**/*.js'],
	theme: {
		extend: {
			minWidth: {
				sidebar: '16rem',
				20: '5rem',
			},
			height: {
				fullbar: 'calc(100vh - 50px)',
			},
		},
	},
	plugins: [require('flowbite/plugin')],
};
