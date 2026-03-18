import { FlagSettings } from "/framework/feature-flags"

const IndexEngineFeatureFlag: FlagSettings = {
  key: "index_engine",
  default_val: false,
  env_key: "ACMEKIT_FF_INDEX_ENGINE",
  description: "Enable AcmeKit to use the index engine in some part of the core",
}

export default IndexEngineFeatureFlag
