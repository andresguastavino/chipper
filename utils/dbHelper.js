import { doc, setDoc } from 'firebase/firestore'

export const insertUser = async (db, data, auth) => {
  const result = {}
  try {
    await setDoc(doc(db, 'users', data.uid), data)
    result.success = true
  } catch (e) {
    auth.currentUser.delete()
    console.error('Error adding user: ', e)
    result.error = true
  }
  return result
}
