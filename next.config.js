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
	},
	output: 'export',
	basePath: '/discordle'
}

module.exports = nextConfig
