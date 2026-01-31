/**
 * @oas [get] /store/gift-cards/{idOrCode}
 * operationId: GetGiftCardsIdorcode
 * summary: Get a Gift Card
 * x-sidebar-summary: Get Gift Card
 * description: Retrieve a gift card by its ID or code. You can expand the gift card's relations or select the fields that should be returned.
 * x-authenticated: false
 * x-ignoreCleanup: true
 * parameters:
 *   - name: idOrCode
 *     in: path
 *     description: The gift card's ID or code.
 *     required: true
 *     schema:
 *       type: string
 *   - name: x-publishable-api-key
 *     in: header
 *     description: Publishable API Key created in the AcmeKit Admin.
 *     required: true
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://docs.acmekit.com/api/store#publishable-api-key
 *   - name: fields
 *     in: query
 *     description: |-
 *       Comma-separated fields that should be included in the returned data.
 *        if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *        without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/store/gift-cards/{idOrCode}' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Gift Cards
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
 * x-badges:
 *   - text: Cloud
 *     description: |
 *       This API route is only available in [AcmeKit Cloud](https://docs.acmekit.com/cloud/loyalty-plugin).
 * 
*/

