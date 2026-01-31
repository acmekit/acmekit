/**
 * @schema AdminImportProducts
 * type: object
 * description: The details of the product's import file.
 * x-schemaName: AdminImportProducts
 * required:
 *   - file_key
 *   - originalname
 *   - extension
 *   - size
 *   - mime_type
 * properties:
 *   file_key:
 *     type: string
 *     title: file_key
 *     description: The name of the file as stored in the configured File Module Provider.
 *   originalname:
 *     type: string
 *     title: originalname
 *     description: The file's original name.
 *   extension:
 *     type: string
 *     title: extension
 *     description: The file's extension.
 *     example: csv
 *   size:
 *     type: number
 *     title: size
 *     description: The file's size in bytes.
 *   mime_type:
 *     type: string
 *     title: mime_type
 *     description: The file's mime type.
 *     example: text/csv
 * 
*/

