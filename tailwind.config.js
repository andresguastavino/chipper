/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 1.5s linear infinite'
      },
      colors: {
        'background-start': '#bfdbfe',
        'background-end': '#adb8c5'
      }
    }
  },
  plugins: []
}
