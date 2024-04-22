import { useEffect, useRef, useState } from 'react'
import IBufferingFetchContext, { getDefaultBufferingFetchContext } from './IBufferingFetchContext'
import BufferingFetchContext from './BufferingFetchContext'
import moment from 'moment'

interface IProps {
	readonly children: JSX.Element
}

interface IBufferedData {
	readonly url: string
	readonly data: any
}

interface IQueue {
	readonly fnc: any
	readonly url: string
}

const BufferingFetchContextProvider = ({ children }: IProps) => {
	const [buffering, setBuffering] = useState<IBufferedData[]>([])
	const [queue, setQueue] = useState<IQueue[]>([])
	const lastTime = useRef(moment())
	const working = useRef(false)

	const setBufferingFetch = async (url: string) =>
		new Promise(async (resolve, reject) => {
			setQueue((prev) => [
				...prev,
				{
					url: url,
					fnc: (a: any) => resolve(a)
				}
			])
		})

	useEffect(() => {
		if (working.current) return
		const processQueue = async () => {
			working.current = true
			if (queue.length > 0) {
				if (moment().diff(lastTime.current, 'milliseconds') > 100) {
					const fnc = queue[0].fnc

					const buffer = buffering.find((b) => b.url === queue[0].url)
					if (!!buffer) {
						working.current = false
						setQueue((prev) => prev.slice(1))
						return fnc(buffer.data)
					}
					lastTime.current = moment()
					try {
						const urlPart = queue[0].url.split('?')
						const newUrl = urlPart[0] + '?cv=' + moment().unix() + '&' + urlPart[1]
						const sbRq = await fetch(newUrl)
						const data = await sbRq.json()

						setBuffering((prev) => [...prev, { url: queue[0].url, data }])
						working.current = false
						setQueue((prev) => prev.slice(1))

						return fnc(data)
					} catch (error) {
						console.error(error)
						working.current = false
						setQueue((prev) => prev.slice(1))
						return fnc(undefined)
					}
				} else {
					setTimeout(() => {
						processQueue()
					}, 100)
				}
			}
			working.current = false
		}
		processQueue()
	}, [queue])

	return (
		<BufferingFetchContext.Provider value={{ getBuffered: setBufferingFetch }}>
			{children}
		</BufferingFetchContext.Provider>
	)
}

export default BufferingFetchContextProvider
