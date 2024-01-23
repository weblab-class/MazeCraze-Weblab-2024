/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "#0B1354",
        "primary-text": "#FCCF14",
        "primary-pink": "#FDC0CD",
        "primary-block": "#006BE5",
      },
      height: {
        "768px": "300px",
      },
      transitionDuration: {
        2000: "2000ms",
      },
    },
    fontFamily: {
      custom: ["CustomFont", "mono"],
    },
  },
  plugins: [],
};
