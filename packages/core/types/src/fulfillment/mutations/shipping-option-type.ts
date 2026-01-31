/**
 * The shipping option type to be created.
 */
export interface CreateShippingOptionTypeDTO {
  /**
   * The label of the shipping option type.
   */
  label: string

  /**
   * The description of the shipping option type.
   */
  description?: string

  /**
   * The code of the shipping option type.
   */
  code: string
}

/**
 * The attributes to update in the shipping option type.
 */
export interface UpdateShippingOptionTypeDTO
  extends Partial<CreateShippingOptionTypeDTO> {
  /**
   * The ID of the shipping option type.
   */
  id?: string
}

/**
 * A shipping option type to be created or updated.
 */
export interface UpsertShippingOptionTypeDTO extends UpdateShippingOptionTypeDTO {}
