/** @type {import('tailwindcss').Config} */


module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.{html,css}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {

        // Blue theme
        blue_0: "#0000FF",  // Replace with your desired blue color
        blueBackground: "#ADD8E6",

        light_0: "#FAFAFA",
        lightDiv: "white",

        lightProfile: "#404040",
        lightProfileName: "#101010",

        lightPostText: "#181818", /*300*/
        lightPostTime: "#696969", /*400*/
        lightPostIcon: "#181818",  /*400*/

        lightNavTop: "white",
        lightGlass: "rgba(255, 255, 255, 0.349)",


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

        // dark: "#18191a",    /*900*/
        dark: "#0f0f0f",    /*900*/
        // darkDiv: "#242526", /*800*/
        darkDiv: "#1D1D1D", /*800*/

        darkProfile: "#404040",     /*700*/
        darkProfileName: "#e5e5e5", /*200*/

        darkPostText: "#d4d4d4", /*300*/
        darkPostTime: "#a3a3a3", /*400*/
        darkPostIcon: "#737373",  /*400*/

        darkNavTop: "",

        // darkInput: "#404040",
        darkInput: "#2C2C2C",

        // Colors ####################################################

        black_0: "#fff",
        white_0: "#fafafa",
        aqua_0: "#06b6d4",
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(150deg, #23accd, #d41583)', // Light mode gradient
        'gradient-dark': 'linear-gradient(150deg, #CB04FF, #0095ff   )',   // Dark mode gradient
      },
      animation: {
        'blinkStatus': 'blinkStatus 2s infinite',
      },
      keyframes: {
        'blinkStatus': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': { opacity: 0 },
        },
      },
      extend: {
        textColor: {
          // Define text color variants for hover in dark mode
          'dark-hover': 'pink', // Replace with your desired dark hover text color
        },
      },

    },

  },
  plugins: [],
}

