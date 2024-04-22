/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	future: {
		webpack5: true
	},
	build: {
		env: {}
	},
	i18n: {
		localeDetection: false,
		locales: ['fr', 'en'],
		defaultLocale: 'fr'
	}
}

module.exports = nextConfig
