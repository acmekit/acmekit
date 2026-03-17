/**
 * @oas [get] /admin/feature-flags
 * operationId: GetFeatureFlags
 * summary: List Feature Flags
 * description: Retrieve a list of feature flags. The feature flags can be filtered by fields such as `id`. The feature flags can also be sorted or paginated.
 * x-authenticated: false
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/admin/feature-flags'
 * tags:
 *   - Feature Flags
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: SUMMARY
 *           required:
 *             - feature_flags
 *           properties:
 *             feature_flags:
 *               type: object
 *               description: The list of feature flags.
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
 * x-since: 2.10.0
 * 
*/

