/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["ui-sans-serif", "sans-serif"],
        pop: ["Poppins", "sans-serif"],
      },
      colors: {
        heading: "#11175D",
        secondary: "#C3C5D7",
        primary: "#505050",
        error: "#AFADBA",
        chatTwo: "#F1F1F1",
      },
      screens: {
        sm: "412px",
        md3: "667px",
        md2: "684px",
        md: "734px",
        md4: "768px",
        lg: "1024px",
      },
    },
  },
  plugins: [],
};
