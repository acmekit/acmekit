/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@acmekit/ui-preset")],
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
}
