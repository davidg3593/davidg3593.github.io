import { createContext } from 'react'
import IBufferingFetchContext, { getDefaultBufferingFetchContext } from './IBufferingFetchContext'

const BufferingFetchContext = createContext<IBufferingFetchContext>(getDefaultBufferingFetchContext())
export default BufferingFetchContext
