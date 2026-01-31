export interface TrackAnalyticsEventDTO {
  /**
   * The event name
   */
  event: string
  /**
   * The actor of the event, if there is any
   */
  actor_id?: string
  /**
   * The group that the event is for, such as an organization or team.
   */
  group?: {
    /**
     * The name of the group.
     * 
     * @example
     * "organization"
     */
    type?: string
    /**
     * The group's ID.
     */
    id?: string
  }
  /**
   * The properties of the event. The format and content is dynamic and depends on the integrated provider.
   */
  properties?: Record<string, any>
}

export interface IdentifyActorDTO {
  /**
   * The actor of the event, if there is any.
   */
  actor_id: string
  /**
   * The properties of the actor. The format and content is dynamic and depends on the integrated provider.
   */
  properties?: Record<string, any>
}

export interface IdentifyGroupDTO {
  /**
   * The group that the event is for, such as an organization or team.
   */
  group: {
    /**
     * The name of the group.
     * 
     * @example
     * "organization"
     */
    type: string
    /**
     * The group's ID.
     */
    id: string
  }
  /**
   * When identifying a group, the actor can potentially be passed as well as metadata.
   */
  actor_id?: string
  /**
   * The properties of the group. The format and content is dynamic and depends on the integrated provider.
   */
  properties?: Record<string, any>
}

/**
 * Either the `actor_id` or the `group` property must be set.
 */
export type IdentifyAnalyticsEventDTO = IdentifyActorDTO | IdentifyGroupDTO
