import { FlagSettings } from "@acmekit/framework/feature-flags"

const CachingFeatureFlag: FlagSettings = {
  key: "caching",
  default_val: false,
  env_key: "ACMEKIT_FF_CACHING",
  description: "[WIP] Enable core caching where applicable",
}

export default CachingFeatureFlag
