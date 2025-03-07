import { createContext } from 'react'
import type { IGlobalContext } from '@/types/contexts'

export const globalContext = createContext<IGlobalContext>({
  isAuthorized: false,
  setIsAuthorized: () => {},
  users: [],
  setGlobalState: () => {},
});
