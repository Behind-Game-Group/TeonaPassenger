/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html.twig',
    './assets/react/components/**/*.tsx',
    './assets/react/components/**/*.js',
    './assets/react/pages/**/*.tsx',
    './assets/react/pages/**/*.js',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // require('tw-elements/dist/plugin')
  ],
  safelist: [
    'h-screen',
    'w - screen',
    'flex',
    'justify-center',
    'items - center',
    'bg-black',
    'bg-white',
    'h-full'
  ]
}

