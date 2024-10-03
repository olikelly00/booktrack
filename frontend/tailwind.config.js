/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "default-bg-color": "#fef7d7",
        "error-text": "#ac2d0f",
        "success-text": "#3c7c6c",
        "film-bg-color": "#9B3F2A",
        "tv-bg-color": "#366F60",
        "book-bg-color": "#D0734B",
        "theater-bg-color": "#CFC2A0",
      },
    },
  },
  plugins: [],
};
