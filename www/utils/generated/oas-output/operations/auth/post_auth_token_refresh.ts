/**
 * @oas [post] /auth/token/refresh
 * operationId: PostTokenRefresh
 * summary: Create Token
 * description: Create a token.
 * x-authenticated: false
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
 *       const token = await sdk.auth.refresh()
 * 
 *       // all subsequent requests will use the token in the header
 *       const { customer } = await sdk.store.customer.retrieve()
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/auth/token/refresh'
 * tags:
 *   - Token
 * responses:
 *   "200":
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
 * 
*/

