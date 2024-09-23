/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height:{
        '9.5/10-vh':'95vh',
        '1/10-vh':'10vh',
        '2.5/10-vh':'25vh'
      },
      // <uniquifier>: Use a unique and descriptive class name


    },
  },
  plugins: [],
}