/**
 * @schema AdminUpdateShippingOption
 * type: object
 * description: The properties to update in the shipping option type.
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The shipping option's name.
 *   data:
 *     type: object
 *     description: The shipping option's data.
 *   price_type:
 *     type: string
 *     description: The shipping option's price type.
 *     enum:
 *       - flat
 *       - calculated
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The shipping option's provider id.
 *   shipping_profile_id:
 *     type: string
 *     title: shipping_profile_id
 *     description: The shipping option's shipping profile id.
 *   type:
 *     $ref: "#/components/schemas/AdminCreateShippingOptionType"
 *   type_id:
 *     type: string
 *     title: type_id
 *     description: The shipping option's type id.
 *   prices:
 *     type: array
 *     description: The shipping option's prices.
 *     items:
 *       oneOf:
 *         - type: object
 *           description: The price's prices.
 *           x-schemaName: AdminUpdateShippingOptionPriceWithCurrency
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The price's ID.
 *             currency_code:
 *               type: string
 *               title: currency_code
 *               description: The price's currency code.
 *             amount:
 *               type: number
 *               title: amount
 *               description: The price's amount.
 *             rules:
 *               type: array
 *               description: The price's rules.
 *               items:
 *                 type: object
 *                 description: The rule's rules.
 *                 x-schemaName: PriceRule
 *                 required:
 *                   - attribute
 *                   - operator
 *                   - value
 *                 properties:
 *                   attribute:
 *                     type: string
 *                     title: attribute
 *                     description: The rule's attribute.
 *                   operator:
 *                     type: string
 *                     description: The rule's operator.
 *                     enum:
 *                       - gt
 *                       - lt
 *                       - eq
 *                       - lte
 *                       - gte
 *                   value:
 *                     type: number
 *                     title: value
 *                     description: The rule's value.
 *         - type: object
 *           description: The price's prices.
 *           x-schemaName: AdminUpdateShippingOptionPriceWithRegion
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The price's ID.
 *             region_id:
 *               type: string
 *               title: region_id
 *               description: The price's region id.
 *             amount:
 *               type: number
 *               title: amount
 *               description: The price's amount.
 *             rules:
 *               type: array
 *               description: The price's rules.
 *               items:
 *                 type: object
 *                 description: The rule's rules.
 *                 x-schemaName: PriceRule
 *                 required:
 *                   - attribute
 *                   - operator
 *                   - value
 *                 properties:
 *                   attribute:
 *                     type: string
 *                     title: attribute
 *                     description: The rule's attribute.
 *                   operator:
 *                     type: string
 *                     description: The rule's operator.
 *                     enum:
 *                       - gt
 *                       - lt
 *                       - eq
 *                       - lte
 *                       - gte
 *                   value:
 *                     type: number
 *                     title: value
 *                     description: The rule's value.
 *   rules:
 *     type: array
 *     description: The shipping option's rules.
 *     items:
 *       oneOf:
 *         - type: object
 *           description: The rule's rules.
 *           x-schemaName: AdminCreateShippingOptionRule
 *           required:
 *             - operator
 *             - attribute
 *             - value
 *           properties:
 *             operator:
 *               type: string
 *               description: The rule's operator.
 *               enum:
 *                 - gt
 *                 - lt
 *                 - eq
 *                 - ne
 *                 - in
 *                 - lte
 *                 - gte
 *                 - nin
 *             attribute:
 *               type: string
 *               title: attribute
 *               description: The rule's attribute.
 *             value:
 *               oneOf:
 *                 - type: string
 *                   title: value
 *                   description: The rule's value.
 *                 - type: array
 *                   description: The rule's value.
 *                   items:
 *                     type: string
 *                     title: value
 *                     description: The value's details.
 *         - type: object
 *           description: The rule's rules.
 *           x-schemaName: AdminUpdateShippingOptionRule
 *           required:
 *             - id
 *             - operator
 *             - attribute
 *             - value
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The rule's ID.
 *             operator:
 *               type: string
 *               description: The rule's operator.
 *               enum:
 *                 - gt
 *                 - lt
 *                 - eq
 *                 - ne
 *                 - in
 *                 - lte
 *                 - gte
 *                 - nin
 *             attribute:
 *               type: string
 *               title: attribute
 *               description: The rule's attribute.
 *             value:
 *               oneOf:
 *                 - type: string
 *                   title: value
 *                   description: The rule's value.
 *                 - type: array
 *                   description: The rule's value.
 *                   items:
 *                     type: string
 *                     title: value
 *                     description: The value's details.
 *   metadata:
 *     type: object
 *     description: The shipping option's metadata.
 * x-schemaName: AdminUpdateShippingOption
 * 
*/

