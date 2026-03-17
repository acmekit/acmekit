import { describe, expect, it, vi } from "vitest"

import * as utils from "../../utils"
import { generateI18n } from "../generate-i18n"

// Mock the dependencies
vi.mock("../../utils", async () => {
  const actual = await vi.importActual("../../utils")
  return {
    ...actual,
    crawl: vi.fn(),
  }
})

const expectedI18nSingleSource = `
    resources: i18nTranslations0
`

const expectedI18nMultipleSources = `
    resources: deepMerge(deepMerge(i18nTranslations0, i18nTranslations1), i18nTranslations2)
`

const expectedI18nNoSources = `
    resources: {}
`

describe("generateI18n", () => {
  it("should generate i18n with single source", async () => {
    const mockFiles = ["Users/user/medusa/src/admin/i18n/index.ts"]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    const result = await generateI18n(
      new Set(["Users/user/medusa/src/admin"])
    )

    expect(result.imports).toEqual([
      `import i18nTranslations0 from "Users/user/medusa/src/admin/i18n/index.ts"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedI18nSingleSource)
    )
  })

  it("should handle windows paths", async () => {
    const mockFiles = ["C:\\medusa\\src\\admin\\i18n\\index.ts"]
    vi.mocked(utils.crawl).mockResolvedValue(mockFiles)

    const result = await generateI18n(new Set(["C:\\medusa\\src\\admin"]))

    expect(result.imports).toEqual([
      `import i18nTranslations0 from "C:/medusa/src/admin/i18n/index.ts"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedI18nSingleSource)
    )
  })

  it("should generate i18n with multiple sources", async () => {
    vi.mocked(utils.crawl)
      .mockResolvedValueOnce(["Users/user/medusa/src/admin/i18n/index.ts"])
      .mockResolvedValueOnce(["Users/user/medusa/src/plugin1/i18n/index.ts"])
      .mockResolvedValueOnce(["Users/user/medusa/src/plugin2/i18n/index.ts"])

    const result = await generateI18n(
      new Set([
        "Users/user/medusa/src/admin",
        "Users/user/medusa/src/plugin1",
        "Users/user/medusa/src/plugin2",
      ])
    )

    expect(result.imports).toEqual([
      `import i18nTranslations0 from "Users/user/medusa/src/admin/i18n/index.ts"`,
      `import i18nTranslations1 from "Users/user/medusa/src/plugin1/i18n/index.ts"`,
      `import i18nTranslations2 from "Users/user/medusa/src/plugin2/i18n/index.ts"`,
    ])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedI18nMultipleSources)
    )
  })

  it("should handle no i18n sources", async () => {
    vi.mocked(utils.crawl).mockResolvedValue([])

    const result = await generateI18n(
      new Set(["Users/user/medusa/src/admin"])
    )

    expect(result.imports).toEqual([])
    expect(utils.normalizeString(result.code)).toEqual(
      utils.normalizeString(expectedI18nNoSources)
    )
  })
})
