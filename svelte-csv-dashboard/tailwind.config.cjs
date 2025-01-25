const plugin = require('flowbite/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}', // Svelte files
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}' // Flowbite-Svelte components
  ],
  theme: {
    extend: {},
  },
  plugins: [plugin],
};
