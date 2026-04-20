/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        segmentEnter: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pageFadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "segment-enter":
          "segmentEnter 0.88s cubic-bezier(0.33, 1, 0.68, 1) both",
        "page-fade-in": "pageFadeIn 0.38s ease-out both"
      }
    }
  },
  plugins: []
};
