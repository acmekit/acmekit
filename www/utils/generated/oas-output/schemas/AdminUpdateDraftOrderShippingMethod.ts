/**
 * @schema AdminUpdateDraftOrderShippingMethod
 * type: object
 * description: The updates to make on a draft order's shipping method.
 * x-schemaName: AdminUpdateDraftOrderShippingMethod
 * properties:
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The ID of the associated shipping option.
 *   custom_amount:
 *     type: number
 *     title: custom_amount
 *     description: The custom amount of the shipping method. If not provided, the shipping option's amount will be used.
 *   internal_note:
 *     type: string
 *     title: internal_note
 *     description: A note viewed only by admin users about the shipping method.
 * 
*/

