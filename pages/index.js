import { useEffect, useContext } from 'react'
import { FirebaseContext } from '@/contexts/FirebaseContext'
import { signUserOut } from '@/utils/authHelper'
import { useRouter } from 'next/router'

export default function Home () {
  const { auth, logged } = useContext(FirebaseContext)
  const router = useRouter()

  useEffect(() => {
    if (!logged) router.push('/auth/login')
  }, [])

  const handleLogOut = async (e) => {
    await signUserOut(auth)
    router.push('/auth/login')
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
