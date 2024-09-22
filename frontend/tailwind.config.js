/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "default-bg-color": "#fef7d7",
        "error-text": "#ac2d0f",
        "success-text": "#3c7c6c",
      },
    },
  },
  plugins: [],
};
