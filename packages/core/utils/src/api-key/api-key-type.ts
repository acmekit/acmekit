/**
 * @enum
 *
 * The API key's type (generic API access).
 */
export enum ApiKeyType {
  /**
   * Client key for public/client API access (e.g. frontend, mobile apps).
   */
  CLIENT = "client",
  /**
   * Secret key for server/admin API access.
   */
  SECRET = "secret",
}

/** Header used to pass client API key for API access. */
export const CLIENT_API_KEY_HEADER = "x-client-api-key"
