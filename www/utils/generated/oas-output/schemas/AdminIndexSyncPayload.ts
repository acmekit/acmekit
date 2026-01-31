/**
 * @schema AdminIndexSyncPayload
 * type: object
 * description: The details of the index sync.
 * x-schemaName: AdminIndexSyncPayload
 * required:
 *   - strategy
 * properties:
 *   strategy:
 *     type: string
 *     description: The syncing strategy. `full` indicates a full reindex, while `reset` truncates tables and performs a fresh sync.
 *     enum:
 *       - full
 *       - reset
 * 
*/

