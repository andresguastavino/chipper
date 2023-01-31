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

export const findEmailByUsername = async (db, username) => {
  const result = {}
  try {
    const q = query(collection(db, 'users'), where('username', '==', username))
    const results = await getDocs(q)
    let email = ''
    results.forEach(result => {
      const data = result.data()
      if (data.username === username) {
        email = data.email
      }
    })
    if (email.length) {
      result.success = true
      result.email = email
    } else {
      result.error = true
    }
  } catch (e) {
    result.error = true
  }
  return result
}
