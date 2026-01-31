import "@acmekit/utils"
export * from "@acmekit/types"

import type { ModuleOptions as ModuleOptionsType } from "@acmekit/types"

// Re-declare ModuleOptions to enable augmentation from @acmekit/framework/types
// EventBusEventsOptions is exported via "export *" and gets augmentations from @acmekit/utils
export interface ModuleOptions extends ModuleOptionsType {}
