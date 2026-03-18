import { ModuleProvider, Modules } from "/framework/utils"
import Loader from "./loaders"
import { RedisLockingProvider } from "./services/redis-lock"

const services = [RedisLockingProvider]
const loaders = [Loader]

export default ModuleProvider(Modules.LOCKING, {
  services,
  loaders,
})
