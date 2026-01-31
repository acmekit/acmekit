/**
 * @schema AdminBatchLink
 * type: object
 * description: A batch operation to manage the associations between two entities.
 * properties:
 *   add:
 *     type: array
 *     description: The IDs of an entity to add to the other.
 *     items:
 *       type: string
 *       title: add
 *       description: The entity's ID.
 *   remove:
 *     type: array
 *     description: The IDs of an entity to remove from the other.
 *     items:
 *       type: string
 *       title: remove
 *       description: The entity's ID.
 * x-schemaName: AdminBatchLink
 * 
*/

