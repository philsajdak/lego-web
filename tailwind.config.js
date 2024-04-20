/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/views/home.ejs",
    "./public/views/about.ejs",
    "./public/views/404.ejs",
    "./public/views/partials/navbar.ejs",
    "./public/views/sets.ejs",
    "./public/views/set.ejs",
    "./public/views/500.ejs",
    "./public/views/addSet.ejs",
    "./public/views/editSet.ejs"
  ],
  daisyui: {
    themes: ["nord"],
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
};

