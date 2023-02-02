import { useState, useEffect, useRef } from 'react'

export default function Modal ({ show, children, showCloseModal, closeModal = () => {}, childrenContainerClassNames = '' }) {
  const [buttonContainerWidth, setButtonContainerWidth] = useState('auto')
  const childrenContainerRef = useRef(null)

  useEffect(() => {
    if (show && childrenContainerRef.current) {
      setButtonContainerWidth(childrenContainerRef.current.offsetWidth)
    }
  }, [show])

  if (show && (showCloseModal || childrenContainerClassNames.length)) {
    return (
      <article className="modal absolute top-0 left-0 w-screen h-screen flex flex-wrap justify-center content-center items-center bg-gray-800 bg-opacity-60">
        { showCloseModal && (
          <>
            <div className="modal-button-container h-auto p-4 flex justify-center" style={{ width: `${buttonContainerWidth}px` }}>
              <button className="text-white font-bold text-6xl w-full text-right" onClick={closeModal}>x</button>
            </div>
            <div className="w-full"/>
          </>
        )}
        <div className={childrenContainerClassNames} ref={childrenContainerRef}>
          { children }
        </div>
      </article>
    )
  }

  if (show && !showCloseModal) {
    return (
      <article className="modal absolute top-0 left-0 w-screen h-screen flex flex-wrap justify-center items-center bg-gray-800 bg-opacity-60">
        { children }
      </article>
    )
  }
}
