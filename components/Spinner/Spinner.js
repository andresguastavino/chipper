import { useState, useEffect } from 'react'

export default function Spinner () {
  const [letterIndex, setLetterIndex] = useState(0)
  const [intervalId, setIntervalId] = useState(null)

  const wordArray = [...'Loading']

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLetterIndex(prevLetterIndex => prevLetterIndex === wordArray.length ? 0 : prevLetterIndex + 1)
    }, 500)
    setIntervalId(intervalId)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="spinner w-3/4 lg:w-1/4 h-1/2 md:h-3/4 lg:h-1/2 flex flex-wrap justify-center content-center items-center">
      <div className="spinner-animation w-full h-2/4 flex justify-center content-end items-end">
        <div className="spinner w-16 h-16 border-8 border-yellow-700 border-l-white rounded-full animate-spin-slow"/>
      </div>
      <div className="spinner-text select-none w-full h-1/4 flex flex-wrap justify-center">
        <p className="text-center font-bold text-white text-3xl">
          { letterIndex > 0 ? Array.from(Array(letterIndex).keys()).map(index => wordArray[index]).join('') : ' ' }
        </p>
      </div>
    </div>
  )
}
