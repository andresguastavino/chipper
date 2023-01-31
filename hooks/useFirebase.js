// Import the functions you need from the SDKs you need
import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDlT4XC7dCllL90iw5N6SjO-NyDAFy9OB0',
  authDomain: 'chipper-backend.firebaseapp.com',
  projectId: 'chipper-backend',
  storageBucket: 'chipper-backend.appspot.com',
  messagingSenderId: '580337271898',
  appId: '1:580337271898:web:f6ce338c4457a9c8d68463'
}

export default function useFirebase () {
  const [app, setApp] = useState(null)
  const [auth, setAuth] = useState(null)
  const [logged, setLogged] = useState(false)
  const [db, setDb] = useState(null)

  useEffect(() => {
    const app = initializeApp(firebaseConfig)
    setApp(app)
    const auth = getAuth(app)
    setAuth(auth)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogged(true)
      } else {
        setLogged(false)
      }
    })
    const db = getFirestore(app)
    setDb(db)
  }, [])

  return { app, auth, logged, db }
}
