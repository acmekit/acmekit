import { defineMiddlewares } from "../utils/define-middlewares"
import { adminApiKeyRoutesMiddlewares } from "./admin/api-keys/middlewares"
import { adminCustomerGroupRoutesMiddlewares } from "./admin/customer-groups/middlewares"
import { adminCustomerRoutesMiddlewares } from "./admin/customers/middlewares"
import { adminInviteRoutesMiddlewares } from "./admin/invites/middlewares"
import { adminNotificationRoutesMiddlewares } from "./admin/notifications/middlewares"
import { adminRbacRoutesMiddlewares } from "./admin/rbac/middlewares"
import { adminStoreRoutesMiddlewares } from "./admin/stores/middlewares"
import { adminUploadRoutesMiddlewares } from "./admin/uploads/middlewares"
import { adminUserRoutesMiddlewares } from "./admin/users/middlewares"
import { columnRoutesMiddlewares } from "./admin/views/[entity]/columns/middlewares"
import { viewConfigurationRoutesMiddlewares } from "./admin/views/[entity]/configurations/middlewares"
import { adminWorkflowsExecutionsMiddlewares } from "./admin/workflows-executions/middlewares"
import { authRoutesMiddlewares } from "./auth/middlewares"
import { adminIndexRoutesMiddlewares } from "./admin/index/middlewares"
import { adminLocalesRoutesMiddlewares } from "./admin/locales/middlewares"
import { adminTranslationsRoutesMiddlewares } from "./admin/translations/middlewares"
import { cloudRoutesMiddlewares } from "./cloud/middlewares"

export default defineMiddlewares([
  ...authRoutesMiddlewares,
  ...adminWorkflowsExecutionsMiddlewares,
  ...adminRbacRoutesMiddlewares,
  ...adminUserRoutesMiddlewares,
  ...adminInviteRoutesMiddlewares,
  ...adminTranslationsRoutesMiddlewares,
  ...adminApiKeyRoutesMiddlewares,
  ...adminStoreRoutesMiddlewares,
  ...adminCustomerGroupRoutesMiddlewares,
  ...adminCustomerRoutesMiddlewares,
  ...adminLocalesRoutesMiddlewares,
  ...adminUploadRoutesMiddlewares,
  ...adminNotificationRoutesMiddlewares,
  ...viewConfigurationRoutesMiddlewares,
  ...columnRoutesMiddlewares,
  ...adminIndexRoutesMiddlewares,
  ...cloudRoutesMiddlewares,
])
