export interface AdminPlugin {
  /**
   * The plugin's name.
   */
  name: string
}

export interface AdminPluginsListResponse {
  /**
   * The plugin's details.
   */
  plugins: AdminPlugin[]
}
