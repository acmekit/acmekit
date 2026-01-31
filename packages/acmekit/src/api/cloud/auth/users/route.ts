import {
  createUserAccountWorkflow,
  setAuthAppMetadataWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
} from "@acmekit/framework/utils"

export const POST = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // If user already exists for this auth identity, reject
  if (req.auth_context.actor_id) {
    throw new AcmeKitError(
      AcmeKitError.Types.INVALID_DATA,
      "The user is already registered and cannot create a new account."
    )
  }

  if (!req.auth_context.user_metadata.email) {
    throw new AcmeKitError(
      AcmeKitError.Types.INVALID_DATA,
      "Email is required to create a user account."
    )
  }

  // Check that the auth identity is from AcmeKit Cloud
  const providerIdentities = await query
    .graph({
      entity: "auth_identity",
      fields: ["id", "provider_identities.provider"],
      filters: {
        id: req.auth_context.auth_identity_id,
      },
    })
    .then((result) => result.data[0]?.provider_identities)
  if (
    providerIdentities?.length !== 1 ||
    providerIdentities[0].provider !== "cloud"
  ) {
    throw new AcmeKitError(
      AcmeKitError.Types.UNAUTHORIZED,
      "Only cloud identities can create a user account"
    )
  }

  // Check if a user already exists
  const user = await query
    .graph({
      entity: "user",
      fields: ["id"],
      filters: {
        email: req.auth_context.user_metadata.email,
      },
    })
    .then((result) => result.data[0])

  if (user) {
    await setAuthAppMetadataWorkflow(req.scope).run({
      input: {
        authIdentityId: req.auth_context.auth_identity_id,
        actorType: "user",
        value: user.id,
      },
    })

    const updatedUser = await query
      .graph({
        entity: "user",
        fields: ["*"],
        filters: {
          id: user.id,
        },
      })
      .then((result) => result.data[0])

    res.status(200).json({ user: updatedUser })
    return
  }

  const { result: createdUser } = await createUserAccountWorkflow(
    req.scope
  ).run({
    input: {
      authIdentityId: req.auth_context.auth_identity_id,
      userData: {
        email: req.auth_context.user_metadata.email as string,
        first_name: req.auth_context.user_metadata.given_name as string,
        last_name: req.auth_context.user_metadata.family_name as string,
      },
    },
  })

  res.status(200).json({ user: createdUser })
}
