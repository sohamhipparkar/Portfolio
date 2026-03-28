/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
        bounce: "bounce 1s infinite",
      },
      keyframes: {
        blob: {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
        },
      },
    },
  },
  plugins: [
    {
      handler({ addUtilities }) {
        addUtilities({
          ".animation-delay-2000": {
            "animation-delay": "2s",
          },
          ".animation-delay-4000": {
            "animation-delay": "4s",
          },
          ".animation-delay-6000": {
            "animation-delay": "6s",
          },
        });
      },
    },
  ],
};
