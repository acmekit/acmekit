/**
 * @schema AdminUpdateStockLocation
 * type: object
 * description: The properties to update in a stock location.
 * x-schemaName: AdminUpdateStockLocation
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The stock location's name.
 *   address:
 *     $ref: "#/components/schemas/AdminUpsertStockLocationAddress"
 *   address_id:
 *     type: string
 *     title: address_id
 *     description: The ID of an existing stock location address to associate the stock location with.
 *   metadata:
 *     type: object
 *     description: The stock location's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 * 
*/

