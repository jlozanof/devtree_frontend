/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage:{
        'home':"url('bg.jpg')"
      }
    },
    backgroundSize:{
      "home-xl" : "50%"
    },
    fontFamily:{
      header: ['Nunito'],
      subtitle_h2: ['Roboto'],
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

