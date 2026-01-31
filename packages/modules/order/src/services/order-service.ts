import {
  Context,
  DAL,
  FindConfig,
  InferEntityType,
  OrderTypes,
  RepositoryService,
} from "@acmekit/framework/types"
import {
  InjectManager,
  AcmeKitContext,
  AcmeKitError,
  ModulesSdkUtils,
} from "@acmekit/framework/utils"
import { Order } from "@models"

type InjectedDependencies = {
  orderRepository: DAL.RepositoryService
}

export default class OrderService extends ModulesSdkUtils.AcmeKitInternalService<
  InjectedDependencies,
  InferEntityType<typeof Order>
>(Order) {
  protected readonly orderRepository_: RepositoryService<
    InferEntityType<typeof Order>
  >

  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.orderRepository_ = container.orderRepository
  }

  @InjectManager("orderRepository_")
  async retrieveOrderVersion<TEntityMethod = OrderTypes.OrderDTO>(
    id: string,
    version: number,
    config: FindConfig<TEntityMethod> = {},
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<typeof Order> {
    const queryConfig = ModulesSdkUtils.buildQuery<typeof Order>(
      { id, items: { version } },
      { ...config, take: 1 } as any
    )
    const [result] = await this.orderRepository_.find(
      queryConfig,
      sharedContext
    )

    if (!result) {
      throw new AcmeKitError(
        AcmeKitError.Types.NOT_FOUND,
        `Order with id: "${id}" and version: "${version}" not found`
      )
    }

    return result
  }
}
