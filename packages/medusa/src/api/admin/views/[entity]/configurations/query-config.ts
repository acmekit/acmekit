export const defaultViewConfigurationFields = [
  "id",
  "entity",
  "name",
  "user_id",
  "is_system_default",
  "configuration",
  "created_at",
  "updated_at",
]

export const retrieveViewConfigurationList = {
  defaults: defaultViewConfigurationFields,
  isList: true,
}

export const retrieveViewConfiguration = {
  defaults: defaultViewConfigurationFields,
  isList: false,
}