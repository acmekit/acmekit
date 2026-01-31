import { Transformer } from "unified"

export function remarkAttachFrontmatterDataPlugin(): Transformer {
  return async (tree, file) => {
    const { matter } = await import("vfile-matter")

    matter(file)
  }
}
