/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html.twig',
    './app/assets/react/components/**/*.tsx',
    './app/assets/react/components/**/*.js',
    './app/assets/react/pages/**/*.tsx',
    './app/assets/react/pages/**/*.js',
    './app/assets/react/**/*.tsx',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        customBlue: 'rgba(19, 154, 210, 1)',
        customOrange: "rgba(223, 141, 34, 1)",
      },
    },
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
