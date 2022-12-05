/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}', './node_modules/flowbite-react/**/*.js'],
	theme: {
		extend: {
			minWidth: {
				sidebar: '16rem',
			},
			height: {
				fullbar: '85vh',
			},
		},
	},
	plugins: [require('flowbite/plugin')],
};
