/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {

        lightIcon: '#84878a',
        lightTime: '#bcc0c4',
        lightOption: '#f0f2f5',
        light: "#FAFAFA",

        border: "#ccc",
        // ---------------------------------------------

        dark: '#3b3b3b',
        darkDiv: '#262626',

        darkProfileName: '#e8e8e8',
        darkTime: '#bcbcbc',

        darkPostText: '#d6d6d6',
        darkInput: '#3b3b3b',
        darkIcon: "#bfbfbf",

        // -------------------------------------------
        white_0: '#fff',
        black_0: '#000000',
      },
    },
  },
  plugins: [],
}

