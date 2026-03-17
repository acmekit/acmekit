/**
 * @oas [delete] /admin/fulfillment-sets/{id}/service-zones/{zone_id}
 * operationId: DeleteFulfillmentSetsIdServiceZonesZone_id
 * summary: Remove a Service Zone from Fulfillment Set
 * x-sidebar-summary: Remove Service Zone
 * description: Remove a service zone that belongs to a fulfillment set.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The fulfillment set's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: zone_id
 *     in: path
 *     description: The service zone's ID.
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
 *       sdk.admin.fulfillmentSet.deleteServiceZone(
 *         "fset_123", 
 *         "serzo_123",
 *       )
 *       .then(({ deleted, parent: fulfillmentSet }) => {
 *         console.log(deleted, fulfillmentSet)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: "curl -X DELETE '{backend_url}/admin/fulfillment-sets/{id}/service-zones/{zone_id}' \\ -H 'Authorization: Bearer {jwt_token}'"
 * tags:
 *   - Fulfillment Sets
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminServiceZoneDeleteResponse"
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
 * x-workflow: deleteServiceZonesWorkflow
 * x-events: []
 * 
*/

