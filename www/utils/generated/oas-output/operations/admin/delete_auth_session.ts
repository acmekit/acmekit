/**
 * @oas [delete] /auth/session
 * operationId: DeleteSession
 * summary: Delete Authentication Session
 * description: Deletes the cookie session ID previously set for authentication.
 * x-authenticated: true
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
 *       await sdk.auth.logout()
 * 
 *       // user is now logged out
 *       // you can't send any requests that require authentication
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/auth/session' \
 *       -H 'Cookie: connect.sid={sid}'
 * tags:
 *   - Auth
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The deletion's details.
 *           required:
 *             - success
 *           properties:
 *             success:
 *               type: boolean
 *               title: success
 *               description: Whether the session was deleted successfully.
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

