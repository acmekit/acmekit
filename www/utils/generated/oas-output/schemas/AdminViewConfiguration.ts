/**
 * @schema AdminViewConfiguration
 * type: object
 * description: The details of a view configuration.
 * x-schemaName: AdminViewConfiguration
 * required:
 *   - id
 *   - entity
 *   - name
 *   - user_id
 *   - is_system_default
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The view configuration's ID.
 *   entity:
 *     type: string
 *     title: entity
 *     description: The entity the view configuration belongs to.
 *   name:
 *     type: string
 *     title: name
 *     description: The view configuration's name.
 *   user_id:
 *     type: string
 *     title: user_id
 *     description: The ID of the user the view configuration belongs to. If `null`, the view configuration is a system default.
 *   is_system_default:
 *     type: boolean
 *     title: is_system_default
 *     description: Whether the view configuration is the system default.
 *   configuration:
 *     type: object
 *     description: The view's configuration.
 *     required:
 *       - visible_columns
 *       - column_order
 *     properties:
 *       visible_columns:
 *         type: array
 *         description: The configuration's visible columns.
 *         items:
 *           type: string
 *           title: visible_columns
 *           description: The visible column's name.
 *       column_order:
 *         type: array
 *         description: The columns in the order they should be displayed.
 *         items:
 *           type: string
 *           title: column_order
 *           description: The column's name.
 *       column_widths:
 *         type: object
 *         description: The column widths in the view.
 *       filters:
 *         type: object
 *         description: The filters applied to the view.
 *       sorting:
 *         type: object
 *         description: The sorting applied to the view.
 *         required:
 *           - id
 *           - desc
 *         properties:
 *           id:
 *             type: string
 *             title: id
 *             description: The ID of the sorting column.
 *           desc:
 *             type: boolean
 *             title: desc
 *             description: Whether the sorting is descending.
 *       search:
 *         type: string
 *         title: search
 *         description: The configuration's search.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the view configuration was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the view configuration was updated.
 * 
*/

