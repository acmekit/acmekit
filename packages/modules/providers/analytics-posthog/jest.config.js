const defineJestConfig = require("../../../../define_jest_config")
module.exports = defineJestConfig({
  moduleNameMapper: {
    "^@services": "<rootDir>/src/services",
  },
})
