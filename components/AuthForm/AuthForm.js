import { useRef, useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '@/contexts/FirebaseContext'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function AuthForm ({ isRegister, isLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const { auth, logged } = useContext(FirebaseContext)
  const router = useRouter()

  useEffect(() => {
    if (logged) router.push('/')
  }, [logged])

  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)

  const handleSignIn = async (e) => {
    const email = emailInputRef.current.value
    const password = passwordInputRef.current.value
    if (isRegister) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          const { code, message } = err
          console.error(code)
          console.error(message)
        })
    } else if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          const { code, message } = err
          console.error(code)
          console.error(message)
        })
    }
  }

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
    <section className="container w-screen h-screen flex justify-center items-center">
      <article className="auth-form w-11/12 md:w-2/5 h-full md:h-3/6 p-4 ">
        <header className="auth-form-header w-full">
          <h1>
            { isRegister && 'Registrate' }
            { isLogin && 'Logineate' }
          </h1>
        </header>
        <main className="auth-form-body flex-row">
          <div className="auth-form-row">
            <label
              className="auth-form-label w-full"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              className="auth-form-input w-full"
              name="email"
              id="email"
              ref={emailInputRef}
            />
          </div>
          <div className="auth-form-row">
            <label
              className="auth-form-label w-full"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              className="auth-form-input w-full"
              name="password"
              id="password"
              ref={passwordInputRef}
            />
          </div>
        </main>
        <footer className="auth-form-footer">
          <button type="button" onClick={handleSignIn}>
            { isRegister && 'Registrarme' }
            { isLogin && 'Logearme' }
          </button>
        </footer>
      </article>

      {/* <h2>{ logged && 'Logeado' }</h2>
      { logged && <button type="button" onClick={handleLogOut}>X</button>}
      { isRegister &&
        <a href='/auth/login'>
          Mejor me quiero logear porque me acorde que ya tengo cuenta
        </a>
      }
      { isLogin &&
        <a href='/auth/register'>
          No tengo cuenta todavia. Me quiero crear una
        </a>
      } */}
    </section>
  )
}

function LoginForm () {
  return (
    <>
    </>
  )
}
