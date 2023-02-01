export default function Modal ({ show, children }) {
  return show && (
    <article className="modal absolute w-screen h-screen flex flex-wrap justify-center items-center bg-gray-800 bg-opacity-60">
      { children }
    </article>
  )
}
