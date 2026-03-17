/**
 * @oas [get] /admin/orders/{id}/line-items
 * operationId: GetOrdersIdLineItems
 * summary: List Line Items
 * description: Retrieve a list of line items in a order. The line items can be filtered by fields like FILTER FIELDS. The line items can also be paginated.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The order's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: |-
 *       Comma-separated fields that should be included in the returned data.
 *       if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *       without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The order's ID.
 *         - type: array
 *           description: The order's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: item_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: item_id
 *           description: The order's item id.
 *         - type: array
 *           description: The order's item id.
 *           items:
 *             type: string
 *             title: item_id
 *             description: The item id's details.
 *   - name: version
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: number
 *           title: version
 *           description: The order's version.
 *         - type: array
 *           description: The order's version.
 *           items:
 *             type: number
 *             title: version
 *             description: The version's details.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.order.listLineItems("order_123")
 *       .then(({ order_items }) => {
 *         console.log(order_items)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/orders/{id}/line-items' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Orders
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: SUMMARY
 *           required:
 *             - order_items
 *           properties:
 *             order_items:
 *               type: array
 *               description: The order's order items.
 *               items:
 *                 $ref: "#/components/schemas/AdminOrderItem"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * 
*/

