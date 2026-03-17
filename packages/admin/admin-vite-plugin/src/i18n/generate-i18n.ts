import { outdent } from "outdent"
import { normalizePath } from "../utils"
import { getI18nIndexFilesFromSources } from "./helpers"

export async function generateI18n(sources: Set<string>) {
    const indexFiles = await getI18nIndexFilesFromSources(sources)

    const imports = indexFiles.map((file, index) => {
        const normalizedPath = normalizePath(file)
        return `import i18nTranslations${index} from "${normalizedPath}"`
    })

    let mergeCode = '{}'
    if (indexFiles.length === 1) {
        mergeCode = 'i18nTranslations0'
    } else if (indexFiles.length > 1) {
        // Only happens in dev mode if there are 2+ plugins linked with plugin:develop
        // Chain deepMerge calls since it only accepts 2 arguments
        mergeCode = indexFiles.slice(1).reduce((acc, _, index) => {
            return `deepMerge(${acc}, i18nTranslations${index + 1})`
        }, 'i18nTranslations0')
    }

    const code = outdent`
        resources: ${mergeCode}
    `

    return {
        imports,
        code,
    }
}

