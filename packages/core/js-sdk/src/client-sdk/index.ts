import { FindParams, HttpTypes, SelectParams } from "@acmekit/types"
import { Client } from "../client"
import { ClientHeaders, FetchArgs } from "../types"

export class ClientSdk {
  /**
   * @ignore
   */
  private client: Client

  protected readonly prefix = "/client"

  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  async fetch<T>(path: string, options?: FetchArgs): Promise<T> {
    return this.client.fetch<T>(path, options)
  }

  /**
   * @tags customer
   */
  public customer = {
    /**
     * This method registers a customer. It sends a request to the [Register Customer](https://docs.medusajs.com/api/store#customers_postcustomers)
     * API route.
     *
     * You must use the {@link Auth.register} method first to retrieve a registration token. Then, pass that
     * registration token in the `headers` parameter of this method as an authorization bearer header.
     *
     * Related guide: [How to register customer in storefront](https://docs.medusajs.com/resources/storefront-development/customers/register)
     *
     * @param body - The customer's details.
     * @param query - Configure the fields to retrieve in the customer.
     * @param headers - Headers to pass in the request. This is where you include the authorization JWT registration token.
     * @returns The customer's details.
     *
     * @example
     * const token = await sdk.auth.register("customer", "emailpass", {
     *   "email": "customer@gmail.com",
     *   "password": "supersecret"
     * })
     *
     * sdk.client.customer.create(
     *   {
     *     "email": "customer@gmail.com"
     *   },
     *   {},
     *   {
     *     Authorization: `Bearer ${token}`
     *   }
     * )
     * .then(({ customer }) => {
     *   console.log(customer)
     * })
     */
    create: async (
      body: HttpTypes.StoreCreateCustomer,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCustomerResponse>(
        `/client/customers`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    /**
     * This method updates the logged-in customer's details. The customer must be logged in
     * first with the {@link Auth.login} method.
     *
     * It sends a request to the
     * [Update Customer](https://docs.medusajs.com/api/store#customers_postcustomersme) API route.
     *
     * Related guide: [How to edit customer's profile in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/profile).
     *
     * @param body - The customer's details to update.
     * @param query - Configure the fields to retrieve in the customer.
     * @param headers - Headers to pass in the request.
     * @returns The customer's details.
     *
     * @example
     * // TODO must be authenticated as the customer to update their details
     * sdk.client.customer.update({
     *   first_name: "John"
     * })
     * .then(({ customer }) => {
     *   console.log(customer)
     * })
     */
    update: async (
      body: HttpTypes.StoreUpdateCustomer,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCustomerResponse>(
        `/client/customers/me`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    /**
     * This method retrieves the logged-in customer's details. The customer must be logged in
     * first with the {@link Auth.login} method.
     *
     * It sends a request to the [Get Logged-In Customer](https://docs.medusajs.com/api/store#customers_getcustomersme)
     * API route.
     *
     * @param query - Configure the fields to retrieve in the customer.
     * @param headers - Headers to pass in the request.
     * @returns The customer's details.
     *
     * @example
     * // TODO must be authenticated as the customer to retrieve their details
     * sdk.client.customer.retrieve()
     * .then(({ customer }) => {
     *   console.log(customer)
     * })
     */
    retrieve: async (query?: SelectParams, headers?: ClientHeaders) => {
      return this.client.fetch<HttpTypes.StoreCustomerResponse>(
        `/client/customers/me`,
        {
          query,
          headers,
        }
      )
    },
    /**
     * This method creates an address for the logged-in customer. The customer must be logged in
     * first with the {@link Auth.login} method.
     *
     * It sends a request to the [Create Address](https://docs.medusajs.com/api/store#customers_postcustomersmeaddresses)
     * API route.
     *
     * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
     *
     * @param body - The address's details.
     * @param query - Configure the fields to retrieve in the customer.
     * @param headers - Headers to pass in the request.
     * @returns The customer's details.
     *
     * @example
     * // TODO must be authenticated as the customer to create an address
     * sdk.client.customer.createAddress({
     *   country_code: "us"
     * })
     * .then(({ customer }) => {
     *   console.log(customer)
     * })
     */
    createAddress: async (
      body: HttpTypes.StoreCreateCustomerAddress,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCustomerResponse>(
        `/client/customers/me/addresses`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    /**
     * This method updates the address of the logged-in customer. The customer must be logged in
     * first with the {@link Auth.login} method.
     *
     * It sends a request to the [Update Address](https://docs.medusajs.com/api/store#customers_postcustomersmeaddressesaddress_id)
     * API route.
     *
     * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
     *
     * @param addressId - The ID of the address to update.
     * @param body - The details to update in the address.
     * @param query - Configure the fields to retrieve in the customer.
     * @param headers - Headers to pass in the request.
     * @returns The customer's details.
     *
     * @example
     * // TODO must be authenticated as the customer to update their address
     * sdk.client.customer.updateAddress(
     *   "caddr_123",
     *   {
     *     country_code: "us"
     *   }
     * )
     * .then(({ customer }) => {
     *   console.log(customer)
     * })
     */
    updateAddress: async (
      addressId: string,
      body: HttpTypes.StoreUpdateCustomerAddress,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCustomerResponse>(
        `/client/customers/me/addresses/${addressId}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    /**
     * This method retrieves the logged-in customer's address. The customer must be logged in
     * first with the {@link Auth.login} method.
     *
     * It sends a request to the [List Customer's Address](https://docs.medusajs.com/api/store#customers_getcustomersmeaddresses)
     * API route.
     *
     * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
     *
     * @param query - Configure the fields to retrieve in the addresses.
     * @param headers - Headers to pass in the request.
     * @returns The paginated list of addresses.
     *
     * @example
     * To retrieve the list of addresses:
     *
     * ```ts
     * // TODO must be authenticated as the customer to list their addresses
     * sdk.client.customer.listAddress()
     * .then(({ addresses, count, offset, limit }) => {
     *   console.log(addresses)
     * })
     * ```
     *
     * To configure the pagination, pass the `limit` and `offset` query parameters.
     *
     * For example, to retrieve only 10 items and skip 10 items:
     *
     * ```ts
     * // TODO must be authenticated as the customer to list their addresses
     * sdk.client.customer.listAddress({
     *   limit: 10,
     *   offset: 10
     * })
     * .then(({ addresses, count, offset, limit }) => {
     *   console.log(addresses)
     * })
     * ```
     *
     * Using the `fields` query parameter, you can specify the fields and relations to retrieve
     * in each address:
     *
     * ```ts
     * // TODO must be authenticated as the customer to list their addresses
     * sdk.client.customer.listAddress({
     *   fields: "id,country_code"
     * })
     * .then(({ addresses, count, offset, limit }) => {
     *   console.log(addresses)
     * })
     * ```
     *
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    listAddress: async (
      query?: FindParams & HttpTypes.StoreCustomerAddressFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCustomerAddressListResponse>(
        `/client/customers/me/addresses`,
        {
          query,
          headers,
        }
      )
    },
    /**
     * This method retrieves an address of the logged-in customer. The customer must be logged in
     * first with the {@link Auth.login} method.
     *
     * It sends a request to the [Get Address](https://docs.medusajs.com/api/store#customers_getcustomersmeaddressesaddress_id)
     * API route.
     *
     * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
     *
     * @param addressId - The address's ID.
     * @param query - Configure the fields to retrieve in the address.
     * @param headers - Headers to pass in the request.
     * @returns The address's details.
     *
     * @example
     * To retrieve an address by its ID:
     *
     * ```ts
     * // TODO must be authenticated as the customer to retrieve their address
     * sdk.client.customer.retrieveAddress(
     *   "caddr_123"
     * )
     * .then(({ address }) => {
     *   console.log(address)
     * })
     * ```
     *
     * To specify the fields and relations to retrieve:
     *
     * ```ts
     * // TODO must be authenticated as the customer to retrieve their address
     * sdk.client.customer.retrieveAddress(
     *   "caddr_123",
     *   {
     *     fields: "id,country_code"
     *   }
     * )
     * .then(({ address }) => {
     *   console.log(address)
     * })
     * ```
     *
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    retrieveAddress: async (
      addressId: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCustomerAddressResponse>(
        `/client/customers/me/addresses/${addressId}`,
        {
          query,
          headers,
        }
      )
    },
    /**
     * This method deletes an address of the logged-in customer. The customer must be logged in
     * first with the {@link Auth.login} method.
     *
     * It sends a request to the [Remove Address](https://docs.medusajs.com/api/store#customers_deletecustomersmeaddressesaddress_id)
     * API route.
     *
     * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
     *
     * @param addressId - The address's ID.
     * @param headers - Headers to pass in the request.
     * @returns The deletion's details.
     *
     * @example
     * // TODO must be authenticated as the customer to delete their address
     * sdk.client.customer.deleteAddress("caddr_123")
     * .then(({ deleted, parent: customer }) => {
     *   console.log(customer)
     * })
     */
    deleteAddress: async (addressId: string, headers?: ClientHeaders) => {
      return this.client.fetch<HttpTypes.StoreCustomerAddressDeleteResponse>(
        `/client/customers/me/addresses/${addressId}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
  }

  /**
   * @tags locale
   */
  public locale = {
    /**
     * This method retrieves the list of supported locales in the store. It sends a request to the
     * [List Locales](https://docs.medusajs.com/api/store#locales_getlocales) API route.
     *
     * @param headers - Headers to pass in the request.
     * @returns The list of supported locales.
     *
     * @example
     * sdk.client.locale.list()
     * .then(({ locales }) => {
     *   console.log(locales)
     * })
     */
    list: async (
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreLocaleListResponse>(
        `/client/locales`,
        {
          headers,
        }
      )
    },
  }
}
