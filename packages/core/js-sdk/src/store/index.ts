import { Client } from "../client"

/**
 * Store API client. Commerce storefront routes (cart, orders, products, etc.) have been removed.
 * Kernel store API (e.g. customers/me, locales) can be extended here when needed.
 */
export class Store {
  /**
   * @ignore
   */
  constructor(_client: Client) {
    // Store API (commerce) removed; client kept for future storefront endpoints
  }
}
