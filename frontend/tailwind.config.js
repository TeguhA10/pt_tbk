/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/app.vue',
    './app/pages/**/*.{vue,js,ts}',
    './app/layouts/**/*.{vue,js,ts}',
    './app/components/**/*.{vue,js,ts}',
    './app/composables/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
