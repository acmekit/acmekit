/**
 * @oas [delete] /admin/payment-collections/{id}
 * operationId: DeletePaymentCollectionsId
 * summary: Delete a Payment Collection
 * description: Delete a payment collection.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The payment collection's ID.
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
 *       sdk.admin.paymentCollection.delete("paycol_123")
 *       .then(({ deleted }) => {
 *         console.log(deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/payment-collections/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Payment Collections
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminDeletePaymentCollectionResponse"
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
 * x-workflow: deleteOrderPaymentCollections
 * x-events: []
 * 
*/

