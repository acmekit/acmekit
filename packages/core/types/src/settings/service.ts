import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import {
  ViewConfigurationDTO,
  UserPreferenceDTO,
  FilterableViewConfigurationProps,
  FilterableUserPreferenceProps,
} from "./common"
import {
  CreateViewConfigurationDTO,
  UpdateViewConfigurationDTO,
} from "./mutations"

export interface ISettingsModuleService extends IModuleService {
  // View Configuration methods
  retrieveViewConfiguration(
    id: string,
    config?: FindConfig<ViewConfigurationDTO>,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO>

  listViewConfigurations(
    filters?: FilterableViewConfigurationProps,
    config?: FindConfig<ViewConfigurationDTO>,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO[]>

  listAndCountViewConfigurations(
    filters?: FilterableViewConfigurationProps,
    config?: FindConfig<ViewConfigurationDTO>,
    sharedContext?: Context
  ): Promise<[ViewConfigurationDTO[], number]>

  createViewConfigurations(
    data: CreateViewConfigurationDTO[],
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO[]>

  createViewConfigurations(
    data: CreateViewConfigurationDTO,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO>

  updateViewConfigurations(
    idOrSelector: string,
    data: UpdateViewConfigurationDTO,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO>

  updateViewConfigurations(
    idOrSelector: FilterableViewConfigurationProps,
    data: UpdateViewConfigurationDTO,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO[]>

  deleteViewConfigurations(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  // User Preference methods
  retrieveUserPreference(
    id: string,
    config?: FindConfig<UserPreferenceDTO>,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO>

  listUserPreferences(
    filters?: FilterableUserPreferenceProps,
    config?: FindConfig<UserPreferenceDTO>,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO[]>

  getUserPreference(
    userId: string,
    key: string,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO | null>

  setUserPreference(
    userId: string,
    key: string,
    value: any,
    sharedContext?: Context
  ): Promise<UserPreferenceDTO>

  deleteUserPreferences(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  // Helper methods
  getActiveViewConfiguration(
    entity: string,
    userId: string,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO | null>

  setActiveViewConfiguration(
    entity: string,
    userId: string,
    viewConfigurationId: string,
    sharedContext?: Context
  ): Promise<void>

  getSystemDefaultViewConfiguration(
    entity: string,
    sharedContext?: Context
  ): Promise<ViewConfigurationDTO | null>

  clearActiveViewConfiguration(
    entity: string,
    userId: string,
    sharedContext?: Context
  ): Promise<void>
}
