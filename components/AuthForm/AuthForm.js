import { useRef, useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '@/contexts/FirebaseContext'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'
import Logo from '../Logo/Logo'

export default function AuthForm ({ isRegister, isLogin }) {
  const { auth, logged } = useContext(FirebaseContext)
  const router = useRouter()

  useEffect(() => {
    if (logged) router.push('/')
  }, [logged])

  const emailInputRef = useRef(null)
  const usernameOrEmailInputRef = useRef(null)
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
    <section className="w-screen h-screen flex flex-wrap justify-center items-center ml-0 mr-0">
      <article className="brand flex w-full lg:w-2/4 h-1/4 lg:h-full bg-yellow-700 p-2 lg:p-6 flex-wrap content-base">
        <div className="logo w-full h-3/4 lg:h-2/4 flex flex-wrap justify-center content-center items-center lg:content-end">
          <Logo classNames={ 'w-1/6 md:w-1/12 lg:w-1/4 lg:h-2/4 m-0 select-none' } />
          <span className="w-auto h-2/4 text-white text-right font-bold text-7xl lg:text-8xl xl:text-9xl flex items-center select-none">Chippy</span>
        </div>
        <div className="text w-full h-1/4 lg:h-2/4 p-2 lg:p-10 text-md lg:text-2xl text-white text-center mt-1 lg:mt-4">
          <p className="select-none lg:hidden">
            <span className="underline">
              We don{"'"}t share our users data.
            </span>
            <span className="underline ml-2">
              Opt-in ads
            </span>
          </p>
          <p className="select-none hidden lg:block underline">We don{"'"}t share our users data</p>
          <p className="mt-2 select-none hidden lg:block underline">Opt-in ads</p>
        </div>
      </article>
      <article className="auth-form w-11/12 lg:w-2/4 h-3/4 lg:h-5/6 p-4 flex flex-wrap mt-10 content-start lg:mt-0 lg:content-center">
        <header className="auth-form-header w-full mb-2 lg:mb-6">
          <h2 className="text-4xl lg:text-5xl text-center font-bold py-4 tracking-widest underline select-none">
            { isRegister ? 'Register' : 'Log-in' }
          </h2>
        </header>
        <main className="auth-form-body flex-row w-full flex flex-wrap justify-center">
          { isRegister
            ? <RegisterBody />
            : <LoginBody usernameOrEmailInputRef={usernameOrEmailInputRef} passwordInputRef={passwordInputRef}/>
          }
        </main>
        <footer className="auth-form-footer w-full mt-2 md:mt-6">
          <div className="auth-form-row w-full md:w-3/4 flex justify-center mx-auto">
            <button
              className="px-3 py-1 md:px-4 md:py-2 text-white font-bold bg-yellow-600 hover:bg-yellow-700 rounded-md"
              type="button"
              onClick={handleClick}
            >
              { isRegister && 'Sign up' }
              { isLogin && 'Sign in' }
            </button>
          </div>
          <div className="auth-form-row w-full sm:w-3/4 md:w-2/4 flex justify-start mx-auto mt-4">
            <a
              className="underline text-blue-700 select-none"
              href={ isRegister ? '/auth/login' : '/auth/register' }
            >
              { isRegister ? 'Sign in instead' : 'Create an account' }
            </a>
          </div>
          { isLogin &&
            <div className="auth-form-row w-full sm:w-3/4 md:w-2/4 flex justify-start mx-auto mt-4">
              <a
                className="underline text-blue-700 select-none"
                href={ isRegister ? '/auth/login' : '/auth/register' }
              >
                Forgot my password
              </a>
            </div>
          }
        </footer>
      </article>
    </section>
  )
}

function LoginBody ({ usernameOrEmailInputRef, passwordInputRef }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div className="auth-form-row my-2 w-full md:w-3/4 flex flex-wrap flex-col mx-auto content-center">
        <label
          className="auth-form-label w-full sm:w-3/4 select-none"
          htmlFor="email"
        >
          Username or email
        </label>
        <input
          type="text"
          className="auth-form-input w-full sm:w-3/4 mt-1 py-1 px-2"
          name="email"
          id="email"
          ref={usernameOrEmailInputRef}
        />
      </div>
      <div className="auth-form-row my-2 w-full md:w-3/4 flex flex-wrap flex-col mx-auto content-center">
        <label
          className="auth-form-label w-full sm:w-3/4 select-none"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type={ showPassword ? 'text' : 'password' }
          className="auth-form-input w-full sm:w-3/4 mt-1 py-1 px-2"
          name="password"
          id="password"
          ref={passwordInputRef}
        />
      </div>
      <div className="auth-form-row my-2 w-full sm:w-3/4 md:w-2/4 flex flex-wrap flex-row mx-auto content-center">
        <input
          type="checkbox"
          className="auth-form-input mr-1 "
          name="show-password"
          id="show-password"
          value={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <label
          className="auth-form-label select-none"
          htmlFor="show-password"
        >
          Show password
        </label>
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
