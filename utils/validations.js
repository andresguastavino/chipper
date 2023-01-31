export const validateEmail = (email, isRegister) => {
  if (!email.length) return { error: true, message: 'This field is mandatory' }
  if (isRegister && !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).test(email)) return { error: true, message: 'Please enter a valid email' }
  return { error: false }
}

export const validateUsername = (username, isRegister) => {
  if (!username.length) return { error: true, message: 'This field is mandatory' }
  if (isRegister && username.length < 5) return { error: true, message: 'The username must have at least 5 characters' }
  return { error: false }
}

export const validatePassword = (password, isRegister) => {
  if (!password.length) return { error: true, message: 'This field is mandatory' }
  if (isRegister && !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).test(password)) {
    return { error: true, message: 'The password must be at least 8 characters long, contain a number, a special character, an upper case letter and a lowecase letter' }
  }
  return { error: false }
}

export const validateAgreedToTerms = (agreedToTerms) => {
  if (!agreedToTerms) return { error: true, message: 'You must agree to the terms of service to register' }
  return { error: false }
}
