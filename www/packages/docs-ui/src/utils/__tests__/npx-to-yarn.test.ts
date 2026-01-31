import { describe, it, expect } from "vitest"
import { npxToYarn } from "../npx-to-yarn.js"

describe("npxToYarn", () => {
  describe("yarn conversion", () => {
    it("should convert basic npx command to yarn", () => {
      const result = npxToYarn("npx acmekit db:migrate", "yarn")
      expect(result).toBe("yarn acmekit db:migrate")
    })

    it("should convert npx command with multiple arguments", () => {
      const result = npxToYarn("npx acmekit develop --port 9000", "yarn")
      expect(result).toBe("yarn acmekit develop --port 9000")
    })

    it("should convert npx command with flags", () => {
      const result = npxToYarn("npx acmekit user --email admin@test.com", "yarn")
      expect(result).toBe("yarn acmekit user --email admin@test.com")
    })

    it("should handle npx command with leading/trailing whitespace", () => {
      const result = npxToYarn("  npx acmekit db:migrate  ", "yarn")
      expect(result).toBe("yarn acmekit db:migrate")
    })

    it("should convert npx command to yarn dlx when isExecutable is true", () => {
      const result = npxToYarn("npx create-acmekit-app@latest", "yarn", true)
      expect(result).toBe("yarn dlx create-acmekit-app@latest")
    })

    it("should convert npx command to yarn when isExecutable is false", () => {
      const result = npxToYarn("npx acmekit db:migrate", "yarn", false)
      expect(result).toBe("yarn acmekit db:migrate")
    })
  })

  describe("pnpm conversion", () => {
    it("should convert basic npx command to pnpm", () => {
      const result = npxToYarn("npx acmekit db:migrate", "pnpm")
      expect(result).toBe("pnpm acmekit db:migrate")
    })

    it("should convert npx command with multiple arguments", () => {
      const result = npxToYarn("npx acmekit develop --port 9000", "pnpm")
      expect(result).toBe("pnpm acmekit develop --port 9000")
    })

    it("should convert npx command with flags", () => {
      const result = npxToYarn("npx acmekit user --email admin@test.com", "pnpm")
      expect(result).toBe("pnpm acmekit user --email admin@test.com")
    })

    it("should handle npx command with leading/trailing whitespace", () => {
      const result = npxToYarn("  npx acmekit db:migrate  ", "pnpm")
      expect(result).toBe("pnpm acmekit db:migrate")
    })

    it("should convert npx command to pnpm dlx when isExecutable is true", () => {
      const result = npxToYarn("npx create-acmekit-app@latest", "pnpm", true)
      expect(result).toBe("pnpm dlx create-acmekit-app@latest")
    })

    it("should convert npx command to pnpm when isExecutable is false", () => {
      const result = npxToYarn("npx acmekit db:migrate", "pnpm", false)
      expect(result).toBe("pnpm acmekit db:migrate")
    })
  })

  describe("edge cases", () => {
    it("should return original command if it does not start with npx", () => {
      const result = npxToYarn("npm install acmekit", "yarn")
      expect(result).toBe("npm install acmekit")
    })

    it("should handle command with only npx and package name", () => {
      const result = npxToYarn("npx acmekit", "yarn")
      expect(result).toBe("yarn acmekit")
    })

    it("should preserve command structure with special characters", () => {
      const result = npxToYarn("npx acmekit db:seed --file=./data.json", "pnpm")
      expect(result).toBe("pnpm acmekit db:seed --file=./data.json")
    })

    it("should handle command with path separators", () => {
      const result = npxToYarn("npx @acmekit/acmekit-cli develop", "yarn")
      expect(result).toBe("yarn @acmekit/acmekit-cli develop")
    })

    it("should handle multi-line commands with backslash continuation", () => {
      const multiLineCommand = `npx create-acmekit-app@latest \\
  --db-url postgres://localhost/acmekit \\
  --skip-db`
      const result = npxToYarn(multiLineCommand, "yarn", true)
      expect(result).toBe(`yarn dlx create-acmekit-app@latest \\
  --db-url postgres://localhost/acmekit \\
  --skip-db`)
    })

    it("should handle multi-line commands for pnpm", () => {
      const multiLineCommand = `npx acmekit develop \\
  --port 9000 \\
  --verbose`
      const result = npxToYarn(multiLineCommand, "pnpm")
      expect(result).toBe(`pnpm acmekit develop \\
  --port 9000 \\
  --verbose`)
    })

    it("should handle commands with newlines", () => {
      const commandWithNewlines = "npx create-acmekit-app@latest\n  --db-url postgres://localhost/acmekit"
      const result = npxToYarn(commandWithNewlines, "yarn", true)
      expect(result).toBe("yarn dlx create-acmekit-app@latest\n  --db-url postgres://localhost/acmekit")
    })

    it("should convert multiple npx commands on separate lines for yarn", () => {
      const multipleCommands = `npx acmekit db:migrate
npx acmekit develop`
      const result = npxToYarn(multipleCommands, "yarn")
      expect(result).toBe(`yarn acmekit db:migrate
yarn acmekit develop`)
    })

    it("should convert multiple npx commands on separate lines for pnpm", () => {
      const multipleCommands = `npx acmekit db:migrate
npx acmekit user --email admin@test.com
npx acmekit develop --port 9000`
      const result = npxToYarn(multipleCommands, "pnpm")
      expect(result).toBe(`pnpm acmekit db:migrate
pnpm acmekit user --email admin@test.com
pnpm acmekit develop --port 9000`)
    })

    it("should convert multiple npx commands with executable flag", () => {
      const multipleCommands = `npx create-acmekit-app@latest
npx @acmekit/acmekit-cli init`
      const result = npxToYarn(multipleCommands, "yarn", true)
      expect(result).toBe(`yarn dlx create-acmekit-app@latest
yarn dlx @acmekit/acmekit-cli init`)
    })

    it("should preserve indentation when converting multiple commands", () => {
      const indentedCommands = `npx acmekit db:migrate
  npx acmekit develop
    npx acmekit user`
      const result = npxToYarn(indentedCommands, "pnpm")
      expect(result).toBe(`pnpm acmekit db:migrate
  pnpm acmekit develop
    pnpm acmekit user`)
    })

    it("should handle mixed npx and non-npx lines", () => {
      const mixedCommands = `npx acmekit db:migrate
echo "Migration complete"
npx acmekit develop`
      const result = npxToYarn(mixedCommands, "yarn")
      expect(result).toBe(`yarn acmekit db:migrate
echo "Migration complete"
yarn acmekit develop`)
    })
  })
})
