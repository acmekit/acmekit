/**
 * @schema AdminAddReturnItem
 * type: object
 * description: An item's details.
 * required:
 *   - id
 *   - quantity
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The item's ID.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity.
 *   description:
 *     type: string
 *     title: description
 *     description: The item's description.
 *   internal_note:
 *     type: string
 *     title: internal_note
 *     description: A note viewed only by admin users.
 *   metadata:
 *     type: object
 *     description: The item's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 * x-schemaName: AdminAddReturnItem
 * 
*/

