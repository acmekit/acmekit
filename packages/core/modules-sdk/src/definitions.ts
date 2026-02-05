import { ModuleDefinition } from "@acmekit/types"
import {
  ContainerRegistrationKeys,
  MODULE_PACKAGE_NAMES,
  Modules,
  upperCaseFirst,
} from "@acmekit/utils"
import { MODULE_SCOPE } from "./types"

export const ModulesDefinition: {
  [key: string]: ModuleDefinition
} = {
  [Modules.EVENT_BUS]: {
    key: Modules.EVENT_BUS,
    defaultPackage: MODULE_PACKAGE_NAMES[Modules.EVENT_BUS],
    label: upperCaseFirst(Modules.EVENT_BUS),
    isRequired: true,
    isQueryable: false,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.CACHE]: {
    key: Modules.CACHE,
    defaultPackage: MODULE_PACKAGE_NAMES[Modules.CACHE],
    label: upperCaseFirst(Modules.CACHE),
    isRequired: true,
    isQueryable: false,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.CACHING]: {
    key: Modules.CACHING,
    defaultPackage: false,
    label: upperCaseFirst(Modules.CACHING),
    isRequired: false,
    isQueryable: false,
    dependencies: [Modules.EVENT_BUS, ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.AUTH]: {
    key: Modules.AUTH,
    defaultPackage: false,
    label: upperCaseFirst(Modules.AUTH),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER, Modules.CACHE],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.WORKFLOW_ENGINE]: {
    key: Modules.WORKFLOW_ENGINE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.WORKFLOW_ENGINE),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    __passSharedContainer: true,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.USER]: {
    key: Modules.USER,
    defaultPackage: false,
    label: upperCaseFirst(Modules.USER),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.API_KEY]: {
    key: Modules.API_KEY,
    defaultPackage: false,
    label: upperCaseFirst(Modules.API_KEY),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.SETTINGS]: {
    key: Modules.SETTINGS,
    defaultPackage: false,
    label: upperCaseFirst(Modules.SETTINGS),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.FILE]: {
    key: Modules.FILE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.FILE),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.NOTIFICATION]: {
    key: Modules.NOTIFICATION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.NOTIFICATION),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.INDEX]: {
    key: Modules.INDEX,
    defaultPackage: false,
    label: upperCaseFirst(Modules.INDEX),
    isRequired: false,
    isQueryable: false,
    dependencies: [
      Modules.EVENT_BUS,
      Modules.LOCKING,
      ContainerRegistrationKeys.LOGGER,
      ContainerRegistrationKeys.REMOTE_QUERY,
      ContainerRegistrationKeys.QUERY,
    ],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.LOCKING]: {
    key: Modules.LOCKING,
    defaultPackage: false,
    label: upperCaseFirst(Modules.LOCKING),
    isRequired: false,
    isQueryable: false,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
}

export const MODULE_DEFINITIONS: ModuleDefinition[] =
  Object.values(ModulesDefinition)

export default MODULE_DEFINITIONS
