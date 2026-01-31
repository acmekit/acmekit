/**
 * Retrieve the pathname of a file without the relative part
 *
 * @param fileName - The file name/path
 * @returns The path without the relative part.
 */
export default function getBasePath(fileName: string) {
  let index = fileName.indexOf("packages/")
  if (index === -1) {
    index = fileName.indexOf("src/")
  }
  return fileName.substring(index)
}
