import type { AppProps } from 'next/app'
import './../styles/global.css'
import BufferingFetchContextProvider from '../constants/contexts/BufferingFetchContext/BufferingFetchContextProvider'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<BufferingFetchContextProvider>
			<Component {...pageProps} />
		</BufferingFetchContextProvider>
	)
}

export default MyApp
