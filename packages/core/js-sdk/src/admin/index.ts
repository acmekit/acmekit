import { Client } from "../client"
import { ApiKey } from "./api-key"
import { Invite } from "./invite"
import { Locale } from "./locale"
import { Notification } from "./notification"
import { Plugin } from "./plugin"
import { Translation } from "./translation"
import { Upload } from "./upload"
import { User } from "./user"
import { Views } from "./views"
import { WorkflowExecution } from "./workflow-execution"

export class Admin {
  /**
   * @tags user
   */
  public invite: Invite
  /**
   * @tags file
   */
  public upload: Upload
  /**
   * @tags notification
   */
  public notification: Notification
  /**
   * @tags user
   */
  public user: User
  /**
   * @tags locale
   * @since 2.12.3
   */
  public locale: Locale
  /**
   * @tags api key
   */
  public apiKey: ApiKey
  /**
   * @tags workflow
   */
  public workflowExecution: WorkflowExecution
  /**
   * @tags translations
   */
  public translation: Translation
  /**
   * @tags plugin
   */
  public plugin: Plugin
  /**
   * @tags views
   * @featureFlag view_configurations
   */
  public views: Views

  constructor(client: Client) {
    this.invite = new Invite(client)
    this.upload = new Upload(client)
    this.notification = new Notification(client)
    this.user = new User(client)
    this.locale = new Locale(client)
    this.apiKey = new ApiKey(client)
    this.workflowExecution = new WorkflowExecution(client)
    this.translation = new Translation(client)
    this.plugin = new Plugin(client)
    this.views = new Views(client)
  }
}
