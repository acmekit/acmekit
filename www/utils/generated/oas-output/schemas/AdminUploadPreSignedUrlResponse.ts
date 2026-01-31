/**
 * @schema AdminUploadPreSignedUrlResponse
 * type: object
 * description: The result of the pre-signed URL upload request.
 * x-schemaName: AdminUploadPreSignedUrlResponse
 * required:
 *   - url
 *   - filename
 *   - originalname
 *   - mime_type
 *   - extension
 *   - size
 * properties:
 *   url:
 *     type: string
 *     title: url
 *     description: The file's pre-signed upload URL.
 *   filename:
 *     type: string
 *     title: filename
 *     description: The file's filename.
 *   originalname:
 *     type: string
 *     title: originalname
 *     description: The file's orignal name.
 *   mime_type:
 *     type: string
 *     title: mime_type
 *     description: The file's mime type.
 *     example: text/csv
 *   extension:
 *     type: string
 *     title: extension
 *     description: The file's extension.
 *     example: csv
 *   size:
 *     type: number
 *     title: size
 *     description: The file's size in bytes.
 * 
*/

