/** @type {import('tailwindcss').Config} */


module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {

        // Blue theme
        blue_0: "#0000FF",  // Replace with your desired blue color
        blueBackground: "#ADD8E6",

        light_0: " #F5F5F5",
        lightDiv: "#FFFFFF",

        lightProfile: "#404040",
        lightProfileName: "#101010",

        lightPostText: "#181818", /*300*/
        lightPostTime: "#696969", /*400*/
        lightPostIcon: "#181818",  /*400*/

        lightNavTop: "white",


        // lightPostIconBottom: "#0f263e",  /*400*/
        lightPostIconBottom: "#A9A9A9",  /*400*/
        // lightPostIconBottom: "#DF013A",  /*400*/

        sender: "#184f82",
        reciver: "#0a2137",

        darkSender: " #171717",
        darkReciver: "#27272a",

        lightInput: "#071726",
        lightOptionText: "#BDBDBD",


        // -------------------------------------------------------------

        dark: "#0a0a0a",    /*900*/
        darkDiv: "#171717", /*800*/

        darkProfile: "#404040",     /*700*/
        darkProfileName: "#e5e5e5", /*200*/

        darkPostText: "#d4d4d4", /*300*/
        darkPostTime: "#a3a3a3", /*400*/
        darkPostIcon: "#737373",  /*400*/

        darkNavTop: "",

        darkInput: "#404040",

        // Colors ####################################################

        black_0: "#fff",
        white_0: "#fafafa",
        aqua_0: "#06b6d4",
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(150deg, #23accd, #d41583)', // Light mode gradient
        'gradient-dark': 'linear-gradient(150deg, #171717, #171717 )',   // Dark mode gradient
      },
    },

  },
  plugins: [],
}

