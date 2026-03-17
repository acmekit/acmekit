/**
 * @oas [post] /admin/products/import/{transaction_id}/confirm
 * operationId: PostProductsImportTransaction_idConfirm
 * summary: Confirm Product Import
 * description: Confirm that a created product import should start importing the products into Medusa.
 * x-authenticated: true
 * parameters:
 *   - name: transaction_id
 *     in: path
 *     description: The ID of the transaction returned when the product import was created.
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
 *       sdk.admin.product.confirmImport("transaction_123")
 *       .then(() => {
 *         console.log("Import confirmed")
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/import/{transaction_id}/confirm' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Products
 * responses:
 *   "202":
 *     description: OK
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
 * deprecated: true
 * x-deprecated_message: use `POST /admin/products/imports/:transaction_id/confirm` instead.
 * 
*/

