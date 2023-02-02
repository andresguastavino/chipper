import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'

export const insertUser = async (db, data) => {
  const result = {}
  try {
    await setDoc(doc(db, 'users', data.uid), data)
    result.success = true
  } catch (e) {
    console.error('Error adding user: ', e)
    result.error = true
  }
  return result
}

export const findUserByEmail = async (db, email) => {
  const result = {}
  try {
    const q = query(collection(db, 'users'), where('email', '==', email))
    const results = await getDocs(q)
    let userData = ''
    results.forEach(result => {
      const data = result.data()
      if (data.email === email) {
        userData = data
      }
    })
    if (Object.keys(userData).length) {
      result.success = true
      result.userData = userData
    } else {
      result.error = true
    }
  } catch (e) {
    result.error = true
  }
  return result
}

export const findEmailByUsername = async (db, username) => {
  const result = {}
  try {
    const q = query(collection(db, 'users'), where('username', '==', username))
    const results = await getDocs(q)
    let userData = ''
    results.forEach(result => {
      const data = result.data()
      if (data.username === username) {
        userData = data
      }
    })
    if (Object.keys(userData).length) {
      result.success = true
      result.userData = userData
    } else {
      result.error = true
    }
  } catch (e) {
    result.error = true
  }
  return result
}
