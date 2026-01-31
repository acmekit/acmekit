import {
  Context,
  CreateSalesChannelDTO,
  DAL,
  FilterableSalesChannelProps,
  InferEntityType,
  InternalModuleDeclaration,
  ISalesChannelModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  SalesChannelDTO,
  UpdateSalesChannelDTO,
  UpsertSalesChannelDTO,
} from "@acmekit/framework/types"
import {
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  isString,
  AcmeKitContext,
  AcmeKitService,
  promiseAll,
} from "@acmekit/framework/utils"

import { SalesChannel } from "@models"
import { UpdateSalesChanneInput } from "@types"
import { joinerConfig } from "../joinfer-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  salesChannelService: ModulesSdkTypes.IAcmeKitInternalService<any>
}

export default class SalesChannelModuleService
  extends AcmeKitService<{ SalesChannel: { dto: SalesChannelDTO } }>({
    SalesChannel,
  })
  implements ISalesChannelModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly salesChannelService_: ModulesSdkTypes.IAcmeKitInternalService<
    InferEntityType<typeof SalesChannel>
  >

  constructor(
    { baseRepository, salesChannelService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.salesChannelService_ = salesChannelService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  // @ts-expect-error
  async createSalesChannels(
    data: CreateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>
  // @ts-expect-error
  async createSalesChannels(
    data: CreateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createSalesChannels(
    data: CreateSalesChannelDTO | CreateSalesChannelDTO[],
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO | SalesChannelDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.createSalesChannels_(input, sharedContext)

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      Array.isArray(data) ? result : result[0]
    )
  }

  @InjectTransactionManager()
  async createSalesChannels_(
    data: CreateSalesChannelDTO[],
    @AcmeKitContext() sharedContext: Context
  ): Promise<InferEntityType<typeof SalesChannel>[]> {
    return await this.salesChannelService_.create(data, sharedContext)
  }

  // @ts-expect-error
  async updateSalesChannels(
    id: string,
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>
  // @ts-expect-error
  async updateSalesChannels(
    selector: FilterableSalesChannelProps,
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateSalesChannels(
    idOrSelector: string | FilterableSalesChannelProps,
    data: UpdateSalesChannelDTO | UpdateSalesChannelDTO[],
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO | SalesChannelDTO[]> {
    let normalizedInput: UpdateSalesChanneInput[] = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const channels = await this.salesChannelService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = channels.map((channel) => ({
        id: channel.id,
        ...data,
      }))
    }

    const result = await this.updateSalesChannels_(
      normalizedInput,
      sharedContext
    )

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      Array.isArray(data) ? result : result[0]
    )
  }

  @InjectTransactionManager()
  async updateSalesChannels_(
    data: UpdateSalesChannelDTO[],
    sharedContext: Context
  ) {
    return await this.salesChannelService_.update(data, sharedContext)
  }

  async upsertSalesChannels(
    data: UpsertSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>
  async upsertSalesChannels(
    data: UpsertSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>
  @InjectManager()
  @EmitEvents()
  @InjectTransactionManager()
  async upsertSalesChannels(
    data: UpsertSalesChannelDTO | UpsertSalesChannelDTO[],
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO | SalesChannelDTO[]> {
    const result = await this.upsertSalesChannels_(data, sharedContext)

    return await this.baseRepository_.serialize<
      SalesChannelDTO[] | SalesChannelDTO
    >(Array.isArray(data) ? result : result[0])
  }

  @InjectTransactionManager()
  protected async upsertSalesChannels_(
    data: UpsertSalesChannelDTO | UpsertSalesChannelDTO[],
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof SalesChannel>[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (channel): channel is UpdateSalesChannelDTO => !!channel.id
    )
    const forCreate = input.filter(
      (channel): channel is CreateSalesChannelDTO => !channel.id
    )

    const operations: Promise<InferEntityType<typeof SalesChannel>[]>[] = []

    if (forCreate.length) {
      operations.push(this.createSalesChannels_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.updateSalesChannels_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()

    return result
  }
}
