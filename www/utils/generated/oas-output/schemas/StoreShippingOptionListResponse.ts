/**
 * @schema StoreShippingOptionListResponse
 * type: object
 * description: The list of shipping options.
 * x-schemaName: StoreShippingOptionListResponse
 * required:
 *   - shipping_options
 * properties:
 *   shipping_options:
 *     type: array
 *     description: The list of shipping options.
 *     items:
 *       allOf:
 *         - $ref: "#/components/schemas/StoreCartShippingOption"
 *         - type: object
 *           description: The shipping option's details.
 *           required:
 *             - service_zone
 *           properties:
 *             service_zone:
 *               type: object
 *               description: The shipping option's service zone.
 *               required:
 *                 - id
 *                 - fulfillment_set_id
 *                 - fulfillment_set
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The service zone's ID.
 *                 fulfillment_set_id:
 *                   type: string
 *                   title: fulfillment_set_id
 *                   description: The ID of the service zone's fulfillment set.
 *                 fulfillment_set:
 *                   type: object
 *                   description: The service zone's fulfillment set.
 *                   required:
 *                     - id
 *                     - type
 *                     - location
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The fulfillment set's ID.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The fulfillment set's type.
 *                     location:
 *                       type: object
 *                       description: The fulfillment set's location details.
 *                       required:
 *                         - id
 *                         - address
 *                       properties:
 *                         id:
 *                           type: string
 *                           title: id
 *                           description: The location's ID.
 *                         address:
 *                           type: object
 *                           description: The location's address.
 *                           x-schemaName: StoreFulfillmentAddress
 *                           required:
 *                             - id
 *                             - company
 *                             - address_1
 *                             - address_2
 *                             - city
 *                             - country_code
 *                             - province
 *                             - postal_code
 *                             - phone
 *                             - metadata
 *                             - created_at
 *                             - updated_at
 *                             - deleted_at
 *                           properties:
 *                             id:
 *                               type: string
 *                               title: id
 *                               description: The address's ID.
 *                             company:
 *                               type: string
 *                               title: company
 *                               description: The address's company.
 *                             address_1:
 *                               type: string
 *                               title: address_1
 *                               description: The first line of the address.
 *                             address_2:
 *                               type: string
 *                               title: address_2
 *                               description: The second line of the address.
 *                             city:
 *                               type: string
 *                               title: city
 *                               description: The address's city.
 *                             country_code:
 *                               type: string
 *                               title: country_code
 *                               description: The address's country code.
 *                               example: us
 *                             province:
 *                               type: string
 *                               title: province
 *                               description: The address's province.
 *                             postal_code:
 *                               type: string
 *                               title: postal_code
 *                               description: The address's postal code.
 *                             phone:
 *                               type: string
 *                               title: phone
 *                               description: The address's phone.
 *                             metadata:
 *                               type: object
 *                               description: The address's metadata. Can hold custom key-value pairs.
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                               title: created_at
 *                               description: The date the address was created.
 *                             updated_at:
 *                               type: string
 *                               format: date-time
 *                               title: updated_at
 *                               description: The date the address was updated.
 *                             deleted_at:
 *                               type: string
 *                               format: date-time
 *                               title: deleted_at
 *                               description: The date the address was deleted.
 *       description: The shipping option's details.
 * 
*/

