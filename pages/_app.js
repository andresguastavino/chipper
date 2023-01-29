import { FirebaseContext } from '@/contexts/FirebaseContext'
import useFirebase from '@/hooks/useFirebase'
import '@/styles/globals.css'

export default function App ({ Component, pageProps }) {
  const firebase = useFirebase()

  return (
    <FirebaseContext.Provider value={{ ...firebase }}>
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  )
}
