/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3D5AFE",
        primaryLight: "#6B7FFF",
        background: "#12141C",
        surface: "#1C1F2E",
        surfaceHigh: "#252836",
        border: "#2A2D3E",
        textPrimary: "#FFFFFF",
        textSecondary: "#8F92A1",
        textMuted: "#555873",
        success: "#22c55e",
        error: "#ef4444",
        warning: "#F4A100",
        accent: "#3D5AFE"
      },
      fontFamily: {
        sans: ['System'],
      }
    }
  },
  plugins: []
};
