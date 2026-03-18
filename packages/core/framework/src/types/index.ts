import "/utils"
export * from "/types"

import type { ModuleOptions as ModuleOptionsType } from "/types"

// Re-declare ModuleOptions to enable augmentation from /framework/types
// EventBusEventsOptions is exported via "export *" and gets augmentations from /utils
export interface ModuleOptions extends ModuleOptionsType {}
