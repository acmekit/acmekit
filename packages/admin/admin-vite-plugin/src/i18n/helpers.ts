import { crawl } from "../utils"

/**
 * Get i18n index files from sources
 * Looks for src/admin/i18n/index.ts in each source
 */
export async function getI18nIndexFilesFromSources(
    sources: Set<string>
): Promise<string[]> {
    return (await Promise.all(
        Array.from(sources).map(async (source) =>
            crawl(`${source}/i18n`, "index", { min: 0, max: 0 })
        )
    )).flat()
}
