import { useState, useEffect, useRef, useContext } from 'react'
import { FirebaseContext } from '@/contexts/FirebaseContext'
import { validateEmail } from '@/utils/validations'
import { sendResetPasswordEmail } from '@/utils/authHelper'
import { findUserByEmail } from '@/utils/dbHelper'
import Modal from '../Modal/Modal'
import Spinner from '../Spinner/Spinner'
import CircleCheckIcon from '../CircleCheckIcon/CircleCheckIcon'

export default function ForgotPasswordForm ({ loginEmailInputRef = null, closeModal }) {
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resetPasswordEmailSent, setResetPasswordEmailSent] = useState(false)
  const [email, setEmail] = useState('')
  const emailInputRef = useRef(null)
  const { auth, db } = useContext(FirebaseContext)

  useEffect(() => {
    const loginInputEmailValue = loginEmailInputRef?.current?.value?.trim()
    if (loginInputEmailValue?.length && loginInputEmailValue?.includes('@')) {
      emailInputRef.current.value = loginInputEmailValue
    }
  }, [])

  const handleClick = async () => {
    setLoading(true)
    const email = emailInputRef.current.value.trim()
    const emailValidationResult = validateEmail(email, true)
    if (!emailValidationResult.error) {
      const findUserByEmailResult = await findUserByEmail(db, email)
      if (findUserByEmailResult.success) {
        const sendResetPasswordEmailResult = await sendResetPasswordEmail(auth, email)
        if (sendResetPasswordEmailResult.success) {
          setResetPasswordEmailSent(true)
          setEmail(email)
        } else {
          setErrors({ email: { error: true, message: 'The email you entered doesn\'t belong to an account' } })
        }
      } else {
        setErrors({ email: { error: true, message: 'The email you entered doesn\'t belong to an account' } })
      }
    } else {
      setErrors({ email: emailValidationResult })
    }
    setLoading(false)
  }

  return (
    <div className="w-full h-full">
        <Modal show={loading} showCloseModal={false}>
          <Spinner />
        </Modal>
        <header className="reset-password-header w-full mb-2 lg:mb-6">
          <h2 className="text-1xl lg:text-5xl text-left font-bold tracking-widest underline select-none">
            Reset your password
          </h2>
        </header>
        { !resetPasswordEmailSent && (
          <ResetPasswordForm
            emailInputRef={emailInputRef}
            errors={errors}
            handleClick={handleClick}
          />
        )}
        { resetPasswordEmailSent && <PasswordResetEmailSentNotif email={email} closeModal={closeModal}/> }
    </div>
  )
}

function ResetPasswordForm ({ emailInputRef, errors, handleClick }) {
  return (
    <>
      <main className="reset-password-content py-2">
        <div className="reset-password-row my-2 w-full flex flex-wrap flex-col content-start">
          <label htmlFor="email">
            Tell us your <b>email address</b> and we will send you a link to reset your password
          </label>
        </div>
        <div className="reset-password-row my-2 w-full md:w-3/4 flex flex-wrap flex-col content-start">
          <input
            type="email"
            className={`reset-password-input w-full sm:w-3/4 mt-1 py-1 px-2 rounded-md ${errors?.email?.error && 'border-red-700 border-2'}`}
            name="email"
            id="email"
            placeholder="user@example.com"
            ref={emailInputRef}
          />
          { errors?.email?.error &&
            <p className="w-full text-left text-sm text-red-700 font-bold select-none">{ errors.email.message }</p>
          }
        </div>
      </main>
      <footer className="reset-password-footer w-full mt-2 md:mt-6">
        <div className="reset-password-row w-full md:w-3/4 flex justify-center mx-auto">
          <button
            className="px-3 py-1 md:px-4 md:py-2 text-white font-bold bg-yellow-600 hover:bg-yellow-700 rounded-md"
            type="button"
            onClick={handleClick}
          >
            Send me a link to reset my password
          </button>
        </div>
      </footer>
    </>
  )
}

function PasswordResetEmailSentNotif ({ email, closeModal }) {
  return (
    <>
      <main className="reset-password-content py-2">
        <p className="w-full sm:w-3/4 text-md text-center">
          Thanks for your time! We have already sent you a link to reset your password to { email }
        </p>
        <div className="w-full py-6 flex justify-center fill-green-700">
          <CircleCheckIcon classNames="w-16 h-16" />
        </div>
      </main>
      <footer className="reset-password-footer w-full">
      <div className="reset-password-row w-full md:w-3/4 flex justify-center mx-auto">
        <button
          className="px-3 py-1 md:px-4 md:py-2 text-white font-bold bg-yellow-600 hover:bg-yellow-700 rounded-md"
          type="button"
          onClick={closeModal}
        >
          Close this window
        </button>
      </div>
    </footer>
    </>
  )
}
