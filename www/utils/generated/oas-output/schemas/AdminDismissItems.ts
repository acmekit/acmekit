/**
 * @schema AdminDismissItems
 * type: object
 * description: The items details.
 * x-schemaName: AdminDismissItems
 * properties:
 *   items:
 *     type: array
 *     description: The items details.
 *     items:
 *       type: object
 *       description: An item's details.
 *       required:
 *         - id
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The ID of the item in the order.
 *         quantity:
 *           type: number
 *           title: quantity
 *           description: The item's quantity.
 *         internal_note:
 *           type: string
 *           title: internal_note
 *           description: A note viewed only by admin users.
 * 
*/

