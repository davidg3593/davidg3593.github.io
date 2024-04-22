/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	future: {
		webpack5: true
	},
	env: {
		NEXT_PUBLIC_ZOHO_REFRESH_TOKEN: '1000.ce48c05dc688546dbd49612197c3849a.4c4d417148774708c5e6bcb15928dcb2',
		NEXT_PUBLIC_ZOHO_CLIENT_ID: '1000.TB8UA0N1WQ2MHQI0KMRAESZGR405RH',
		NEXT_PUBLIC_ZOHO_CLIENT_SECRET: '674ad89107d61bca626b7d0e20a7bca015bfe92539',
		NEXT_PUBLIC_ZOHO_PORTAL_ID: '803335834'
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
