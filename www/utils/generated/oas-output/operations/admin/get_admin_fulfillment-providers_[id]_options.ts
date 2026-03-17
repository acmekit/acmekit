/**
 * @oas [get] /admin/fulfillment-providers/{id}/options
 * operationId: GetFulfillmentProvidersIdOptions
 * summary: List Fulfillment Options
 * description: Retrieve the list of fulfillment options of a fulfillment provider. These options may be retrieved from an integrated third-party service.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The fulfillment provider's ID.
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
 *       sdk.admin.fulfillmentProvider.listFulfillmentOptions("fp_123")
 *       .then(({ fulfillment_options }) => {
 *         console.log(fulfillment_options)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/fulfillment-providers/{id}/options' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Fulfillment Providers
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminFulfillmentProviderOptionsListResponse"
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

