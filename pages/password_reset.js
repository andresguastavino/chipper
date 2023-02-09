import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ResetPasswordForm from '@/components/ResetPasswordForm/ResetPasswordForm'
import Modal from '@/components/Modal/Modal'
import Spinner from '@/components/Spinner/Spinner'

export default function PasswordReset () {
  const [code, setCode] = useState('')
  const router = useRouter()

  useEffect(() => {
    const keyword = 'oobCode='
    const path = router.asPath
    if (path.includes(keyword)) {
      const pathSubstring = path.substring(path.indexOf(keyword) + (keyword).length, path.length)
      const code = pathSubstring.substring(0, pathSubstring.indexOf('&'))
      setCode(code)
    } else {
      router.push('/auth/login')
    }
  }, [])

  if (code) return <ResetPasswordForm code={code} />

  return (
    <Modal show={true} showCloseModal={false}>
      <Spinner />
    </Modal>
  )
}
