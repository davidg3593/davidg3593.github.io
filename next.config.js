/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	future: {
		webpack5: true
	},
	output: 'export',
	basePath: '/discordle'
}

module.exports = nextConfig
