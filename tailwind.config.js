/** @type {import('tailwindcss').Config} */


module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {

        // light_0: "#FE2E64",
        // lightDiv: "#FA5882",

        // lightProfile: "#404040",
        // lightProfileName: "#f5f5f5",

        // lightPostText: "#e5e5e5", /*300*/
        // lightPostTime: "#F7819F", /*400*/
        // lightPostIcon: "#FBEFF2",  /*400*/
        // lightPostIconBottom: "#FBEFF2",  /*400*/

        // lightInput: "#07121d",
        // lightOptionText: "#BDBDBD",
        light_0: "#0f263e",
        lightDiv: "#143252",

        lightProfile: "#404040",
        lightProfileName: "#f5f5f5",

        lightPostText: "#e5e5e5", /*300*/
        lightPostTime: "#a3a3a3", /*400*/
        lightPostIcon: "#FFFFFF",  /*400*/
        lightPostIconBottom: "#0f263e",  /*400*/

        sender: "#23394e",
        reciver: "#546575",

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

