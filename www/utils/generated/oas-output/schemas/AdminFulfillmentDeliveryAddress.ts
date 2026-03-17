/**
 * @schema AdminFulfillmentDeliveryAddress
 * type: object
 * description: The address to deliver the items to.
 * properties:
 *   first_name:
 *     type: string
 *     title: first_name
 *     description: The customer's first name.
 *   last_name:
 *     type: string
 *     title: last_name
 *     description: The customer's last name.
 *   phone:
 *     type: string
 *     title: phone
 *     description: The customer's phone.
 *   company:
 *     type: string
 *     title: company
 *     description: The delivery address's company.
 *   address_1:
 *     type: string
 *     title: address_1
 *     description: The delivery address's first line.
 *   address_2:
 *     type: string
 *     title: address_2
 *     description: The delivery address's second line.
 *   city:
 *     type: string
 *     title: city
 *     description: The delivery address's city.
 *   country_code:
 *     type: string
 *     title: country_code
 *     description: The delivery address's country code.
 *   province:
 *     type: string
 *     title: province
 *     description: The delivery address's ISO 3166-2 province code. Must be lower-case.
 *     example: us-ca
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_3166-2
 *       description: Learn more about ISO 3166-2
 *   postal_code:
 *     type: string
 *     title: postal_code
 *     description: The delivery address's postal code.
 *   metadata:
 *     type: object
 *     description: The delivery address's metadata, used to store custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 * x-schemaName: AdminFulfillmentDeliveryAddress
 * 
*/

