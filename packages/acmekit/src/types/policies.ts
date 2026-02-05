/**
 * Default RBAC Policy Resources for AcmeKit
 *
 */

export interface DefaultPolicyResources {
  // Translation resources
  translation: "translation"
  translation_settings: "translation_settings"

  // System resources
  file: "file"
  notification: "notification"
  workflow_execution: "workflow_execution"

  // User resources
  user: "user"
  api_key: "api_key"
  invite: "invite"
}

export type DefaultResourceKey = keyof DefaultPolicyResources

export type DefaultResourceValue = DefaultPolicyResources[DefaultResourceKey]

declare global {
  var PolicyResource: DefaultPolicyResources & Record<string, string>
  var PolicyOperation: Record<string, string> & {
    readonly read: "read"
    readonly write: "write"
    readonly update: "update"
    readonly delete: "delete"
    readonly "*": "*"
    readonly ALL: "*"
  }
  var Policy: Record<
    string,
    { resource: string; operation: string; description?: string }
  >
}
