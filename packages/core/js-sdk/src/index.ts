import { Admin } from "./admin"
import { Auth } from "./auth"
import { Client } from "./client"
import { ClientSdk } from "./client-sdk"
import { Config } from "./types"

class Medusa {
  public httpClient: Client

  public admin: Admin
  public client: ClientSdk
  public auth: Auth

  constructor(config: Config) {
    this.httpClient = new Client(config)

    this.admin = new Admin(this.httpClient)
    this.client = new ClientSdk(this.httpClient)
    this.auth = new Auth(this.httpClient, config)
  }

  setLocale(locale: string) {
    this.httpClient.setLocale(locale)
  }

  getLocale() {
    return this.httpClient.locale
  }
}

export default Medusa

export { FetchError, Client as HttpClient } from "./client"
export { Admin } from "./admin"
export { Auth } from "./auth"
export { ClientSdk } from "./client-sdk"
export {
  Config,
  ClientHeaders,
  ClientFetch,
  FetchArgs,
  FetchInput,
  FetchStreamResponse,
  Logger,
  ServerSentEventMessage,
} from "./types"
