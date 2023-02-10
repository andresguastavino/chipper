import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset
} from 'firebase/auth'

export const registerUser = async (auth, data) => {
  const result = {}
  const { email, password } = data
  await createUserWithEmailAndPassword(auth, email, password)
    .then((res) => {
      result.success = true
      result.uid = res.user.uid
    })
    .catch(err => {
      const errors = {}
      const { code } = err

      if (code === 'auth/email-already-in-use') {
        errors.email = {
          error: true,
          message: 'That email is already in use'
        }
      }

      result.error = true
      result.errors = errors
    })

  return result
}

export const loginUser = async (auth, data) => {
  const result = {}
  const { email, password } = data
  await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      result.success = true
    })
    .catch(err => {
      let errors = {}
      const { code } = err

      if (code === 'auth/user-not-found') {
        errors.usernameOrEmail = {
          error: true,
          message: 'The username or email you entered doesn\'t belong to an account'
        }
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-email') {
        errors = {
          usernameOrEmail: { error: true },
          password: { error: true },
          general: { error: true, message: 'Invalid username or email or password' }
        }
      }

      result.error = true
      result.errors = errors
    })

  return result
}

export const signUserOut = async (auth) => {
  await signOut(auth)
}

export const sendEmailVerif = async (auth) => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser)
  }
}

export const sendResetPasswordEmail = async (auth, email) => {
  const result = {}
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      result.success = true
    })
    .catch(err => {
      console.error(err)
      result.error = true
    })
  return result
}

export const validateCode = async (auth, code) => {
  const result = {}
  await verifyPasswordResetCode(auth, code)
    .then(res => {
      result.success = true
      result.email = res
    })
    .catch(err => {
      console.error(err)
      result.error = true
    })
  return result
}

export const resetUserPassword = async (auth, code, newPassword) => {
  const result = {}
  await confirmPasswordReset(auth, code, newPassword)
    .then(res => {
      result.success = true
    })
    .catch(err => {
      console.error(err)
      result.error = true
    })
  return result
}
