/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#07090C",
        slateGrey: "#1A1F29",
        slateGreySoft: "#2A303B",
        brushedGold: "#C9A24A",
        brushedGoldSoft: "#E5C778",
        textSoft: "#9AA0AA"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      },
      boxShadow: {
        luxe: "0 10px 30px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};
