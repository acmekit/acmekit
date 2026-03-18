import { FlagSettings } from "@acmekit/framework/feature-flags"

export const EnvFeatureFlag: FlagSettings = {
  key: "env_ff",
  default_val: true,
  env_key: "ENV_FF",
  description: "Environment feature flag",
}
