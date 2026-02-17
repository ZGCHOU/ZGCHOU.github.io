/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'handbook-paper': '#fdfaf1',
        'handbook-ink': '#2f3a33', // 更深一点的绿灰色，比纯灰更高级
        'handbook-accent': '#e9ad9a',
        'handbook-green': '#a8bfa1', // 鼠尾草绿
        'handbook-green-light': '#d4dfd1',
        'handbook-blue': '#a5cad2',
        'handbook-yellow': '#f3e5ab',
        'handbook-peach': '#f4d7d3', // 增加甜美感
      },
      borderRadius: {
        'handbook': '2rem', // 更圆润可爱
        'handbook-sm': '1rem',
      },
      boxShadow: {
        'handbook': '0 10px 40px -10px rgba(168, 191, 161, 0.15)', // 带有色相的阴影
        'handbook-hover': '0 20px 50px -12px rgba(168, 191, 161, 0.25)',
      }
    },
  },
  plugins: [],
}
