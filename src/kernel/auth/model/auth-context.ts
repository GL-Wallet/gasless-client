import type { AuthContext } from './types'
import { createContext } from 'react'

export const authContext = createContext({} as AuthContext)
