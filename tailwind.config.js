/** @type {import('tailwindcss').Config} */


module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {

        light_0: "#0a1929",
        lightDiv: "#0b243b",

        lightProfile: "#404040",
        lightProfileName: "#e5e5e5",

        lightPostText: "#d4d4d4", /*300*/
        lightPostTime: "#a3a3a3", /*400*/
        lightPostIcon: "#737373",  /*400*/

        lightInput: "#07121d",
        lightOptionText: "#BDBDBD",


        // -------------------------------------------------------------

        dark: "#171717",    /*900*/
        darkDiv: "#262626", /*800*/

        darkProfile: "#404040",     /*700*/
        darkProfileName: "#e5e5e5", /*200*/

        darkPostText: "#d4d4d4", /*300*/
        darkPostTime: "#a3a3a3", /*400*/
        darkPostIcon: "#737373",  /*400*/

        darkInput: "#404040",

        // Colors ####################################################

        black_0: "#fff",
        white_0: "#fafafa",
        aqua_0: "#06b6d4",
      },
    },

  },
  plugins: [],
}

