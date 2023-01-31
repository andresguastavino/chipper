import { createContext } from 'react'

export const FirebaseContext = createContext({
  app: null,
  auth: null,
  logged: false,
  db: null
})
