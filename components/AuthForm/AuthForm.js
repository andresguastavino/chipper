import PropTypes from 'prop-types'
import { useRef } from 'react'
import useFirebase from '@/hooks/useFirebase'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'

function AuthForm ({ isRegister, isLogin }) {
  const { auth, logged } = useFirebase()

  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)

  const handleSignIn = async (e) => {
    const email = emailInputRef.current.value
    const password = passwordInputRef.current.value
    await createUserWithEmailAndPassword(auth, email, password)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        const { code, message } = err
        console.error(code)
        console.error(message)
      })
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
    <>
      <h2>{ logged ? 'Logeado' : 'No logeado'}</h2>
      { !logged &&
        <div>
          <label>Email</label>
          <input type="text" name="email" ref={emailInputRef}></input>
          <label>Password</label>
          <input type="text" name="password" ref={passwordInputRef}></input>
          <button type="button" onClick={handleSignIn}>Registrarme</button>
        </div>
      }
      { logged && <button type="button" onClick={handleLogOut}>X</button>}
    </>
  )
}

AuthForm.propTypes = {
  isRegister: PropTypes.bool,
  isLogin: PropTypes.bool
}

export default AuthForm
