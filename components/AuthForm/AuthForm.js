import { useRef, useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '@/contexts/FirebaseContext'
import { useRouter } from 'next/router'
import Logo from '../Logo/Logo'
import { validateEmail, validateUsername, validatePassword, validateAgreedToTerms } from '@/utils/validations'
import { registerUser, loginUser, signUserOut, sendEmailVerif } from '@/utils/authHelper'
import { insertUser, findEmailByUsername } from '@/utils/dbHelper'

export default function AuthForm ({ isRegister, isLogin }) {
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const { auth, logged, db } = useContext(FirebaseContext)
  const router = useRouter()

  useEffect(() => {
    if (logged) router.push('/')
  }, [])

  const emailInputRef = useRef(null)
  const usernameInputRef = useRef(null)
  const usernameOrEmailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const agreeToTermsInputRef = useRef(null)

  const handleClick = async (e) => {
    setLoading(true)

    let errors = {}
    let email, username, usernameOrEmail, password, agreedToTerms
    if (isRegister) {
      email = emailInputRef.current.value.trim()
      username = usernameInputRef.current.value.trim()
      password = passwordInputRef.current.value.trim()
      agreedToTerms = agreeToTermsInputRef.current.checked

      errors = {
        email: validateEmail(email, true),
        username: validateUsername(username, true),
        password: validatePassword(password, true),
        agreedToTerms: validateAgreedToTerms(agreedToTerms, true)
      }
    } else if (isLogin) {
      usernameOrEmail = usernameOrEmailInputRef.current.value.trim()
      password = passwordInputRef.current.value.trim()

      errors = {
        usernameOrEmail: usernameOrEmail.includes('@') ? validateEmail(usernameOrEmail, false) : validateUsername(usernameOrEmail, false),
        password: validatePassword(password, false)
      }
    }

    let isError = false
    Object.keys(errors).forEach(key => {
      if (errors[key].error) isError = true
    })

    if (!isError) {
      if (isRegister) {
        const { success, errors: registerErrors, uid } = await registerUser(auth, { email, password })
        if (success) {
          const insertUserResult = await insertUser(db, { uid, email, username })
          if (insertUserResult.success) {
            await sendEmailVerif(auth)
          } else {
            await signUserOut(auth)
          }
        } else {
          errors = registerErrors
          isError = true
        }
      } else if (isLogin) {
        if (!usernameOrEmail.includes('@')) {
          const findEmailByUsernameResult = await findEmailByUsername(db, usernameOrEmail)
          if (findEmailByUsernameResult.success) {
            email = findEmailByUsernameResult.email
          } else {
            errors.usernameOrEmail = {
              error: true,
              message: 'The username or email you entered doesn\'t belong to an account'
            }
            isError = true
          }
        } else {
          email = usernameOrEmail
        }

        if (!isError) {
          const loginResult = await loginUser(auth, { email, password })
          if (loginResult.error) {
            errors = loginResult.errors
            isError = true
          }
        }
      }
    }

    if (!isError) {
      router.push('/')
    }

    setErrors(errors)
    setLoading(false)
  }

  return (
    <section className="w-screen h-screen flex flex-wrap justify-center items-center ml-0 mr-0">
      { loading && <h1 className="text-9xl">Loading</h1>}
      <article className="brand flex w-full lg:w-2/4 h-1/4 lg:h-full bg-yellow-700 p-2 lg:p-6 flex-wrap content-base">
        <div className="logo w-full h-3/4 lg:h-2/4 flex flex-wrap justify-center content-center items-center lg:content-end">
          <Logo classNames={ 'w-20 lg:w-1/6 xl:w-1/4 lg:h-2/4 m-0 select-none' } />
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
            ? <RegisterBody
                emailInputRef={emailInputRef}
                usernameInputRef={usernameInputRef}
                passwordInputRef={passwordInputRef}
                agreeToTermsInputRef={agreeToTermsInputRef}
                errors={errors}
              />
            : <LoginBody
                usernameOrEmailInputRef={usernameOrEmailInputRef}
                passwordInputRef={passwordInputRef}
                errors={errors}
              />
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

function LoginBody ({ usernameOrEmailInputRef, passwordInputRef, errors }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div className="auth-form-row my-2 w-full md:w-3/4 flex flex-wrap flex-col mx-auto content-center">
        <label
          className="auth-form-label w-full sm:w-3/4 select-none"
          htmlFor="username-email"
        >
          Username or email
        </label>
        <input
          type="text"
          className={`auth-form-input w-full sm:w-3/4 mt-1 py-1 px-2 rounded-md ${errors?.usernameOrEmail?.error && 'border-red-700 border-2'}`}
          name="username-email"
          id="username-email"
          ref={usernameOrEmailInputRef}
        />
        { errors?.usernameOrEmail?.error &&
          <p className="w-full sm:w-3/4 text-left text-red-700 font-bold select-none">{ errors.usernameOrEmail.message }</p>
        }
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
          className={`auth-form-input w-full sm:w-3/4 mt-1 py-1 px-2 rounded-md ${errors?.password?.error && 'border-red-700 border-2'}`}
          name="password"
          id="password"
          ref={passwordInputRef}
        />
        { errors?.password?.error &&
          <p className="w-full sm:w-3/4 text-left text-red-700 font-bold select-none">{ errors.password.message }</p>
        }
      </div>
      { errors?.general?.error &&
        <div className="auth-form-row my-2 w-full md:w-3/4 flex flex-wrap flex-col mx-auto content-center">
          <p className="w-full sm:w-3/4 text-left text-red-700 font-bold select-none">{ errors.general.message }</p>
        </div>
      }
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

function RegisterBody ({ usernameInputRef, emailInputRef, passwordInputRef, agreeToTermsInputRef, errors }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div className="auth-form-row my-2 w-full md:w-3/4 flex flex-wrap flex-col mx-auto content-center">
        <label
          className="auth-form-label w-full sm:w-3/4 select-none"
          htmlFor="username"
        >
          Username
        </label>
        <input
          type="text"
          className={`auth-form-input w-full sm:w-3/4 mt-1 py-1 px-2 rounded-md ${errors?.username?.error && 'border-red-700 border-2'}`}
          name="username"
          id="username"
          ref={usernameInputRef}
        />
        { errors?.username?.error &&
          <p className="w-full sm:w-3/4 text-left text-sm text-red-700 font-bold select-none">{ errors.username.message }</p>
        }
      </div>
      <div className="auth-form-row my-2 w-full md:w-3/4 flex flex-wrap flex-col mx-auto content-center">
        <label
          className="auth-form-label w-full sm:w-3/4 select-none"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          className={`auth-form-input w-full sm:w-3/4 mt-1 py-1 px-2 rounded-md ${errors?.email?.error && 'border-red-700 border-2'}`}
          name="email"
          id="email"
          ref={emailInputRef}
        />
        { errors?.email?.error &&
          <p className="w-full sm:w-3/4 text-left text-sm text-red-700 font-bold select-none">{ errors.email.message }</p>
        }
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
          className={`auth-form-input w-full sm:w-3/4 mt-1 py-1 px-2 rounded-md ${errors?.password?.error && 'border-red-700 border-2'}`}
          name="password"
          id="password"
          ref={passwordInputRef}
        />
        { errors?.password?.error &&
          <p className="w-full sm:w-3/4 text-left text-sm text-red-700 font-bold select-none">{ errors.password.message }</p>
        }
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
      <div className='hidden md:block md:w-full'/>
      <div className="auth-form-row my-2 w-full sm:w-3/4 md:w-2/4 flex flex-wrap flex-row mx-auto content-center">
        <input
          type="checkbox"
          className="auth-form-input mr-1"
          name="terms"
          id="terms"
          ref={agreeToTermsInputRef}
        />
        <label
          className="auth-form-label select-none"
          htmlFor="terms"
        >
          I agree to the terms & conditions
        </label>
        { errors?.agreedToTerms?.error &&
          <p className="w-full sm:w-3/4 text-left text-sm text-red-700 font-bold select-none">{ errors.agreedToTerms.message }</p>
        }
      </div>
    </>
  )
}
