/**
 * @oas [post] /admin/exchanges/{id}/inbound/shipping-method
 * operationId: PostExchangesIdInboundShippingMethod
 * summary: Add an Inbound Shipping Method to an Exchange
 * x-sidebar-summary: Add Inbound Shipping
 * description: Add an inbound (or return) shipping method to an exchange. The inbound shipping method will have a `SHIPPING_ADD` action.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The exchange's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostReturnsShippingReqSchema"
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
 *       sdk.admin.exchange.addInboundShipping("exchange_123", {
 *         shipping_option_id: "so_123"
 *       })
 *       .then(({ return: returnData }) => {
 *         console.log(returnData)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/exchanges/{id}/inbound/shipping-method' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "shipping_option_id": "{value}"
 *       }'
 * tags:
 *   - Exchanges
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminExchangeReturnResponse"
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
 * x-workflow: createExchangeShippingMethodWorkflow
 * x-events: []
 * 
*/

