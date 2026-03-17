const defineJestConfig = require("../../../define_jest_config")
module.exports = defineJestConfig({
  moduleNameMapper: {
    "^@services": "<rootDir>/src/services",
    "^@types": "<rootDir>/src/types",
    "^@utils": "<rootDir>/src/utils",
  },
})
