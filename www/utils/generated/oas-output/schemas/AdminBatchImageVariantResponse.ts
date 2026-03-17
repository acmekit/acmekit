/**
 * @schema AdminBatchImageVariantResponse
 * type: object
 * description: Result of managing the associations between variants and a product image.
 * x-schemaName: AdminBatchImageVariantResponse
 * required:
 *   - added
 *   - removed
 * properties:
 *   added:
 *     type: array
 *     description: The IDs of product variants added the image to.
 *     items:
 *       type: string
 *       title: added
 *       description: The ID of the variant added.
 *   removed:
 *     type: array
 *     description: The IDs of product variants removed the image from.
 *     items:
 *       type: string
 *       title: removed
 *       description: The ID of the variant removed.
 * 
*/

