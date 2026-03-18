const path = require("path")

// get the path of the dependency "@acmekit/ui"
const medusaUI = path.join(
  path.dirname(require.resolve("@acmekit/ui")),
  "**/*.{js,jsx,ts,tsx}"
)

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@acmekit/ui-preset")],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", medusaUI],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
}
