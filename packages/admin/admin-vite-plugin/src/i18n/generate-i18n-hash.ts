import fs from "fs/promises"
import { generateHash } from "../utils"
import { getI18nIndexFilesFromSources } from "./helpers"

export async function generateI18nHash(sources: Set<string>): Promise<string> {
    const indexFiles = await getI18nIndexFilesFromSources(sources)

    const contents = await Promise.all(
        indexFiles.map(file => fs.readFile(file, "utf-8"))
    )

    const totalContent = contents.join("")

    return generateHash(totalContent)
}
