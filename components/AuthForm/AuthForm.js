import { useRef, useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '@/contexts/FirebaseContext'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'
import Logo from '../Logo/Logo'

export default function AuthForm ({ isRegister, isLogin }) {
  // const [showPassword, setShowPassword] = useState(false)
  const { auth, logged } = useContext(FirebaseContext)
  const router = useRouter()

  useEffect(() => {
    if (logged) router.push('/')
  }, [logged])

  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)

  const handleClick = async (e) => {
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

  return (
    <section className="container w-screen h-screen flex justify-center items-center ml-0 mr-0">
      <article className="brand hidden md:flex md:w-2/4 h-0 md:h-full bg-red-900 p-6 flex-wrap content-base">
        <Logo classNames={ 'w-2/4 h-2/4 m-0' } />
          <span className="w-2/4 h-2/4 text-white font-bold flex items-end" style={{ fontSize: '18rem', lineHeight: '16rem' }}>Ch</span>
          <span className="w-full h-2/4 text-white font-bold" style={{ fontSize: '18rem', lineHeight: '16rem' }}>ipper</span>
      </article>
      <article className="auth-form w-11/12 md:w-2/4 h-full md:h-5/6 p-4 flex flex-wrap content-center">
        <header className="auth-form-header w-full mb-10">
          <h2 className="text-5xl text-center font-bold py-4 tracking-widest underline">
            { isRegister ? 'Register' : 'Login' }
          </h2>
        </header>
        <main className="auth-form-body flex-row w-full flex flex-wrap justify-center">
          { isRegister
            ? <RegisterBody />
            : <LoginBody emailInputRef={emailInputRef} passwordInputRef={passwordInputRef} />
          }
        </main>
        <footer className="auth-form-footer w-full">
          <div className="auth-form-row w-full flex justify-center items-center">
            <button
              className="px-3 py-1 md:px-6 md:py-3 text-white font-bold bg-red-800"
              type="button"
              onClick={handleClick}
            >
              { isRegister && 'Sign up' }
              { isLogin && 'Sign in' }
            </button>
          </div>
          <div className="auth-form-row w-full flex justify-start mt-4">
            <a
              className="underline text-blue-700"
              href={ isRegister ? '/auth/login' : '/auth/register' }
            >
                { isRegister ? 'Sign in instead' : 'Create an account' }
            </a>
          </div>
        </footer>
      </article>
    </section>
  )
}

function LoginBody ({ emailInputRef, passwordInputRef }) {
  return (
    <>
      <div className="auth-form-row my-2 w-full md:w-3/4 flex flex-wrap flex-col mx-auto content-center">
        <label
          className="auth-form-label w-full md:w-2/4"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          className="auth-form-input w-full md:w-2/4 mt-1"
          name="email"
          id="email"
          ref={emailInputRef}
        />
      </div>
      <div className="auth-form-row my-2 w-full md:w-3/4 flex flex-wrap flex-col mx-auto content-center">
        <label
          className="auth-form-label w-full md:w-2/4"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          className="auth-form-input w-full md:w-2/4 mt-1"
          name="password"
          id="password"
          ref={passwordInputRef}
        />
      </div>
    </>
  )
}

function RegisterBody () {
  return (
    <>
    </>
  )
}
