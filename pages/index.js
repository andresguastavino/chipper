import { useEffect, useContext } from 'react'
import { FirebaseContext } from '@/contexts/FirebaseContext'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function Home () {
  const { auth, logged } = useContext(FirebaseContext)
  const router = useRouter()

  useEffect(() => {
    if (!logged) router.push('/auth/login')
  }, [logged])

  const handleLogOut = async (e) => {
    await signOut(auth)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        const { code, message } = err
        console.error(code)
        console.error(message)
      })
  }

  return (
    <>
      <h1>Chipper</h1>
      <div>
        <p>
          Perdon, aca no hay nada todavia, volve mas tarde
        </p>
      </div>
      { logged && <button type="button" onClick={handleLogOut}>X</button>}
    </>
  )
}
