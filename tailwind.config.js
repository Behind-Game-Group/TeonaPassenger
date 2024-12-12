/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html.twig',
    './assets/react/components/**/*.tsx',
    './assets/react/components/**/*.js',
    './assets/react/pages/**/*.tsx',
    './assets/react/pages/**/*.js',
    './assets/react/**/*.tsx',
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
    'h-[80%]',
    'w-screen', // correction: 'w - screen' -> 'w-screen'
    'w-[30%]',
    'w-[90%]',
    'flex',
    'flex-row',
    'justify-center',
    'items-center', // correction: 'items - center' -> 'items-center'
    'bg-black',
    'bg-white',
    'h-full',
  ],
}
