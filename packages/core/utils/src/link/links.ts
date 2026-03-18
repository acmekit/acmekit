import { Modules } from "../modules-sdk/definition"
import { composeLinkName } from "./compose-link-name"

export const LINKS = {
  UserRbacRole: composeLinkName(
    Modules.USER,
    "user_id",
    Modules.RBAC,
    "rbac_role_id"
  ),
  InviteRbacRole: composeLinkName(
    Modules.USER,
    "invite_id",
    Modules.RBAC,
    "rbac_role_id"
  ),
}
