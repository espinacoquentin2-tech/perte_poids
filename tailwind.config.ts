import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201c",
        canvas: "#f5f7f4",
        brand: { DEFAULT: "#246b4b", soft: "#dff2e8", dark: "#164832" },
      },
      boxShadow: { card: "0 8px 30px rgba(31, 50, 40, 0.07)" },
    },
  },
  plugins: [],
} satisfies Config;
