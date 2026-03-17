import { ApiKeyType } from "../../../api-key"

export interface AdminCreateApiKey {
  /**
   * The API key's title.
   */
  title: string
  /**
   * The API key's type.
   */
  type: ApiKeyType
}

export interface AdminUpdateApiKey {
  /**
   * The API key's title.
   */
  title: string
}

export interface AdminRevokeApiKey {
  /**
   * The number of seconds to wait before revoking the API key.
   */
  revoke_in?: number
}
