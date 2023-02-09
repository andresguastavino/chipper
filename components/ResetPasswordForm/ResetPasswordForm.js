import { useState, useEffect, useRef, useContext } from 'react'
import { FirebaseContext } from '@/contexts/FirebaseContext'
import { validateCode } from '@/utils/authHelper'
import { validatePassword } from '@/utils/validations'
import Modal from '../Modal/Modal'
import Spinner from '../Spinner/Spinner'

export default function ResetPasswordForm ({ code }) {
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(null)
  const [codeValidationResult, setCodeValidationResult] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const { auth } = useContext(FirebaseContext)

  const passwordInputRef = useRef(null)
  const passwordConfirmInputRef = useRef(null)

  useEffect(() => {
    const asyncValidateCode = async () => {
      const codeValidationResult = await validateCode(auth, code)
      setCodeValidationResult(codeValidationResult)
      setLoading(false)
    }
    if (code) {
      asyncValidateCode()
    } else {
      setLoading(false)
    }
  }, [])

  const handleClick = (e) => {
    setLoading(true)

    const password = passwordInputRef.current.value.trim()
    const passwordConfirm = passwordConfirmInputRef.current.value.trim()

    let errors = {
      password: validatePassword(password, false),
      passwordConfirm: validatePassword(passwordConfirm, false)
    }

    let isError = false
    Object.keys(errors).forEach(key => {
      if (errors[key].error) isError = true
    })

    if (!isError) {
      const validatePasswordResult = validatePassword(password, true)
      if (validatePasswordResult.error) {
        errors = {
          password: { error: true },
          passwordConfirm: { error: true },
          general: validatePasswordResult
        }
      } else {
        if (password !== passwordConfirm) {
          errors = {
            password: { error: true },
            passwordConfirm: { error: true },
            general: { error: true, message: 'Passwords does not match' }
          }
        }
      }
    }

    isError = false
    Object.keys(errors).forEach(key => {
      if (errors[key].error) isError = true
    })

    if (!isError) {
      console.log('yippie!')
    }

    setErrors(errors)
    setLoading(false)
  }

  return (
    <section className="w-screen h-screen">
      <Modal show={loading} showCloseModal={false}>
        <Spinner />
      </Modal>
      <Modal
        show={codeValidationResult?.error}
        childrenContainerClassNames="w-3/4 md:w-auto h-auto p-4 sm:p-6 bg-gradient-to-b from-background-start to-background-end"
        showCloseModal={false}
      >
        <div className="w-full">
          <h2 className="text-4xl text-left font-bold tracking-widest underline select-none">
            Invalid or expired link
          </h2>
          <p className="text-1xl text-left font-bold select-none mt-4">
            Please request a new one from the{' '}
              <a
                className="text-1xl text-center text-blue-700 font-bold tracking-widest underline select-none"
                href='/auth/login'
              >
                log-in page
              </a>
          </p>
        </div>
      </Modal>
      <article className="password-reset-form w-full h-full px-10">
        <header className="password-reset-header w-full py-8">
          <h2 className="text-4xl text-left font-bold tracking-widest underline select-none">
            Reset your password
          </h2>
        </header>
        <main className="password-reset-body w-full flex flex-wrap">
          <div className="password-reset-row w-full flex flex-wrap content-center my-2">
            <label
              className="password-reset-label w-full select-none"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="text"
              className="password-reset-input w-full sm:w-1/4 md:w-1/6 mt-1 py-1 px-2 rounded-md bg-gray-300"
              name="email"
              id="email"
              value={codeValidationResult.email}
              disabled={true}
            />
          </div>
          <div className="password-reset-row w-full flex flex-wrap content-center my-2">
            <label
              className="password-reset-label w-full select-none"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type={ showPassword ? 'text' : 'password' }
              className={`password-reset-input w-full sm:w-1/4 md:w-1/6 mt-1 py-1 px-2 rounded-md ${errors?.password?.error && 'border-red-700 border-2'}`}
              name="password"
              id="password"
              ref={passwordInputRef}
            />
            { errors?.password?.error &&
              <p className="w-full text-left text-red-700 font-bold select-none">{ errors.password.message }</p>
            }
          </div>
          <div className="password-reset-row w-full flex flex-wrap flex-row content-center my-2">
            <input
              type="checkbox"
              className="password-reset-input mr-1 "
              name="show-password"
              id="show-password"
              value={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label
              className="password-reset-label select-none"
              htmlFor="show-password"
            >
              Show password
            </label>
          </div>

          <div className="password-reset-row w-full flex flex-wrap content-center my-2">
            <label
              className="password-reset-label w-full select-none"
              htmlFor="password-confirm"
            >
              Confirm your password
            </label>
            <input
              type={ showPasswordConfirm ? 'text' : 'password' }
              className={`password-reset-input w-full sm:w-1/4 md:w-1/6 mt-1 py-1 px-2 rounded-md ${errors?.passwordConfirm?.error && 'border-red-700 border-2'}`}
              name="password-confirm"
              id="password-confirm"
              ref={passwordConfirmInputRef}
            />
            { errors?.passwordConfirm?.error &&
              <p className="w-full text-left text-red-700 font-bold select-none">{ errors.passwordConfirm.message }</p>
            }
          </div>
          <div className="password-reset-row w-full flex flex-wrap flex-row content-center my-2">
            <input
              type="checkbox"
              className="password-reset-input mr-1 "
              name="show-password-confirm"
              id="show-password-confirm"
              value={showPasswordConfirm}
              onChange={() => setShowPasswordConfirm(!showPasswordConfirm)}
            />
            <label
              className="password-reset-label select-none"
              htmlFor="show-password-confirm"
            >
              Show password
            </label>
          </div>
          { errors?.general?.error &&
            <div className="password-reset-row w-full flex flex-wrap flex-row content-center mt-2">
              <p className="w-full text-left text-red-700 font-bold select-none">
                { errors.general.message }
              </p>
            </div>
          }
        </main>
        <footer className="password-reset-footer w-full mt-2 md:mt-6">
          <div className="password-reset-row w-full flex justify-start">
            <button
              className="px-3 py-1 md:px-4 md:py-2 text-white font-bold bg-yellow-600 hover:bg-yellow-700 rounded-md"
              type="button"
              onClick={handleClick}
            >
              Reset my password
            </button>
          </div>
        </footer>
      </article>
    </section>
  )
}
