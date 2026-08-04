/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Official KinetyQ brand palette (brand guide)
        brand: {
          yellow: "#F9C80E",
          "yellow-600": "#E0B300",
          "yellow-100": "#FEF3C6",
          blue: "#0077B6",
          "blue-700": "#016097",
          "blue-800": "#014E7C",
          "blue-100": "#D9EEF8",
          "blue-50": "#EDF7FC",
        },
        ink: {
          DEFAULT: "#2D2D2D", // charcoal
          900: "#1C1C1C",
          800: "#2D2D2D",
          700: "#3D3D3D",
        },
        neutral: {
          // gray #9FA2A5 anchored scale
          50: "#F7F8F8",
          100: "#F1F2F3",
          200: "#E4E6E7",
          300: "#D2D5D7",
          400: "#9FA2A5", // brand gray
          500: "#7C7F82",
          600: "#5F6265",
          700: "#494B4E",
        },
        canvas: "#F6F7F8",
        surface: "#FFFFFF",
        line: "#E4E6E7",
        // semantic status (kept distinct from brand yellow)
        success: "#1B9E5A",
        "success-50": "#E7F6EE",
        warning: "#E08600",
        "warning-50": "#FBEFDD",
        danger: "#D64545",
        "danger-50": "#FBE9E9",
      },
      fontFamily: {
        sans: [
          "Gilroy",
          "Poppins",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Gilroy",
          "Poppins",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(45,45,45,0.04), 0 4px 16px rgba(45,45,45,0.06)",
        pop: "0 8px 30px rgba(45,45,45,0.12)",
        "brand-blue": "0 6px 18px rgba(0,119,182,0.28)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};
