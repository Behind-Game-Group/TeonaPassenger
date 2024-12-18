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
    'h-auto', 
    'min-h-screen',
    'h-[80%]',
    'h-full',
    'h-10',
    'h-32',
    'w-full',
    'w-screen', // correction: 'w - screen' -> 'w-screen'
    'w-[25px]',
    'w-[30%]',
    'w-[90%]',
    'w-10',
    'w-64',
    'w-1/3',
    'w-1/4',
    'min-w-[170px]',
    'max-w-[200px]',
    'max-h-40 opacity-100',
    'max-h-0',
    'max-w-5xl',
    'max-w-6xl',
    'grid',
    'grid-cols-1',
    'sm: grid-cols-2',
    'md: grid-cols-4',
    'space-y-4',
    'sm:space-y-0',
    'sm:space-x-4',
    'sm:w-1/2',
    'sm:w-auto',
    'md:w-1/4',
    'md:grid-cols-3',
    'lg:grid-cols-4',
    'gap-4',
    'gap-6',
    'gap-8',
    'flex',
    'flex-1',
    'flex-row',
    'flex-col',
    'flex-wrap',
    'justify-center',
    'items-center', // correction: 'items - center' -> 'items-center'
    'flex-grow',
    'bg-black',
    'bg-white',
    'bg-blue-500',
    'bg-customOrange',
    'bg-customBlue',
    'bg-transparent',
    'bg-opacity-40',
    'opacity-0', 
    'opacity-100',
    'text-2xl',
    'text-3xl',
    'text-xl',
    'text-lg',
    'text-sm',
    'text-white',
    'text-blue-500',
    'text-gray-700',
    'border',
    'border-none',
    'border-white',
    'border-b',
    'border-b-2',
    'border-r',
    'border-t',
    'border-t-2',
    'border-1',
    'border-2',
    'border-gray-300',
    'mt-6',
    'mt-10',
    'mt-32',
    'mr-36',
    'ml-64',
    'mt-10 px-4',
    'mb-4',
    'mb-6',
    'mb-8',
    'ml-0',
    'ml-2',
    'ml-64',
    'ml-[45px]',
    'p-4',
    'p-5',
    'p-8', 
    'px-4',
    'py-1',
    'py-10',
    'pl-4',
    'pb-2',
    'mx-auto',
    'z-10',
    'z-50',
    'space-y-4',
    'font-bold',
    'font-semibold',
    'text-left',
    'text-center',
    'shadow-md',
    'shadow-lg',
    'rounded-md',
    'rounded-lg',
    'rounded-full',
    'relative',
    'absolute',
    'fixed',
    'top-0',
    'top-7',
    'top-[40px]',
    'top-[124px]',
    'top-[1.3rem]',
    'top-[3.5rem]',
    'left-0',
    'left-10',
    'left-[1.5rem]',
    'right-8',
    'group',
    'group-hover:opacity-100',
    'object-cover',
    'inset-0',
    'accordion',
    'arrow',
    'placeholder-white',
    'overflow-hidden',
    'duration-300',
    'duration-500',
    'ease-in-out',
    'focus:outline-none',
    'hover:brightness-95',
    'hover:bg-white',
    'hover:text-orange-400',
    'p-2',
    'transition-colors',
    'transition-all',
    'transition-opacity',
  ],
}
