/**
 * @oas [get] /admin/orders/{id}/shipping-options
 * operationId: GetOrdersIdShippingOptions
 * summary: List Shipping Options for Order
 * x-sidebar-summary: List Shipping Options
 * description: Retrieve a list of shipping options that can be used for outbound shipping in an order. This is especially useful when adding outbound shipping to order exchanges or claims.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The order's ID.
 *     required: true
 *     schema:
 *       type: string
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
 *       sdk.admin.order.listShippingOptions("order_123")
 *       .then(({ shipping_options }) => {
 *         console.log(shipping_options)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/orders/{id}/shipping-options' \
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
 *           description: The list of shipping options.
 *           required:
 *             - shipping_options
 *           properties:
 *             shipping_options:
 *               type: array
 *               description: The list of shipping options.
 *               items:
 *                 $ref: "#/components/schemas/AdminShippingOption"
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
 * x-workflow: listShippingOptionsForOrderWorkflow
 * x-events: []
 * x-since: 2.10.0
 * 
*/

