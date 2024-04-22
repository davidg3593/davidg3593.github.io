export default interface IBufferingFetchContext {
	getBuffered: (url: string) => any
}

export const getDefaultBufferingFetchContext = (): IBufferingFetchContext => {
	return {
		getBuffered: () => {}
	}
}
