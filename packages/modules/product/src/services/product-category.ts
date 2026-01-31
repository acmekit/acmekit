import {
  Context,
  DAL,
  FindConfig,
  InferEntityType,
  ProductTypes,
} from "@acmekit/framework/types"
import {
  createAcmeKitMikroOrmEventSubscriber,
  FreeTextSearchFilterKeyPrefix,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  AcmeKitContext,
  AcmeKitError,
  AcmeKitInternalService,
  AcmeKitService,
  ModulesSdkUtils,
  registerInternalServiceEventSubscriber,
} from "@acmekit/framework/utils"
import { EntityManager, EventType } from "@mikro-orm/core"
import { ProductCategory } from "@models"
import { ProductCategoryRepository } from "@repositories"
import { UpdateCategoryInput } from "@types"

type InjectedDependencies = {
  productCategoryRepository: DAL.TreeRepositoryService
  productModuleService: ReturnType<typeof AcmeKitService>
}

export default class ProductCategoryService extends AcmeKitInternalService<
  InjectedDependencies,
  typeof ProductCategory
>(ProductCategory) {
  protected readonly productCategoryRepository_: DAL.TreeRepositoryService
  protected readonly container: InjectedDependencies

  constructor(container: InjectedDependencies) {
    // @ts-expect-error
    super(...arguments)
    this.container = container
    this.productCategoryRepository_ = container.productCategoryRepository
  }

  // TODO: Add support for object filter
  @InjectManager("productCategoryRepository_")
  // @ts-expect-error
  async retrieve(
    productCategoryId: string,
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductCategory>> {
    if (!isDefined(productCategoryId)) {
      throw new AcmeKitError(
        AcmeKitError.Types.NOT_FOUND,
        `"productCategoryId" must be defined`
      )
    }

    const queryOptions = ModulesSdkUtils.buildQuery(
      {
        id: productCategoryId,
      },
      config
    )

    // TODO: Currently remoteQuery doesn't allow passing custom objects, so the `include*` are part of the filters
    // Modify remoteQuery to allow passing custom objects
    const transformOptions = {
      includeDescendantsTree: true,
    }

    const productCategories = await this.productCategoryRepository_.find(
      queryOptions,
      transformOptions,
      sharedContext
    )

    if (!productCategories?.length) {
      throw new AcmeKitError(
        AcmeKitError.Types.NOT_FOUND,
        `ProductCategory with id: ${productCategoryId} was not found`
      )
    }

    return productCategories[0]
  }

  @InjectManager("productCategoryRepository_")
  async list(
    filters: ProductTypes.FilterableProductCategoryProps = {},
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductCategory>[]> {
    const transformOptions = {
      includeDescendantsTree: filters?.include_descendants_tree || false,
      includeAncestorsTree: filters?.include_ancestors_tree || false,
    }
    delete filters.include_descendants_tree
    delete filters.include_ancestors_tree

    // Apply free text search filter
    if (isDefined(filters?.q)) {
      config.filters ??= {}
      config.filters[FreeTextSearchFilterKeyPrefix + ProductCategory.name] = {
        value: filters.q,
        fromEntity: ProductCategory.name,
      }

      delete filters.q
    }

    const queryOptions = ModulesSdkUtils.buildQuery(filters, config)
    queryOptions.where ??= {}

    return await this.productCategoryRepository_.find(
      queryOptions,
      transformOptions,
      sharedContext
    )
  }

  @InjectManager("productCategoryRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductCategoryProps = {},
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<[InferEntityType<typeof ProductCategory>[], number]> {
    const transformOptions = {
      includeDescendantsTree: filters?.include_descendants_tree || false,
      includeAncestorsTree: filters?.include_ancestors_tree || false,
    }
    delete filters.include_descendants_tree
    delete filters.include_ancestors_tree

    // Apply free text search filter
    if (isDefined(filters?.q)) {
      config.filters ??= {}
      config.filters[FreeTextSearchFilterKeyPrefix + ProductCategory.name] = {
        value: filters.q,
        fromEntity: ProductCategory.name,
      }

      delete filters.q
    }

    const queryOptions = ModulesSdkUtils.buildQuery(filters, config)
    queryOptions.where ??= {}

    return await this.productCategoryRepository_.findAndCount(
      queryOptions,
      transformOptions,
      sharedContext
    )
  }

  @InjectTransactionManager("productCategoryRepository_")
  async create(
    data: ProductTypes.CreateProductCategoryDTO[],
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductCategory>[]> {
    return await (
      this.productCategoryRepository_ as unknown as ProductCategoryRepository
    ).create(data, sharedContext)
  }

  @InjectTransactionManager("productCategoryRepository_")
  // @ts-expect-error
  async update(
    data: UpdateCategoryInput[],
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductCategory>[]> {
    return await (
      this.productCategoryRepository_ as unknown as ProductCategoryRepository
    ).update(data, sharedContext)
  }

  @InjectTransactionManager("productCategoryRepository_")
  // @ts-expect-error
  async delete(
    ids: string[],
    @AcmeKitContext() sharedContext: Context = {}
  ): Promise<string[]> {
    const subscriber = createAcmeKitMikroOrmEventSubscriber(
      [ProductCategory.name],
      this.container["productModuleService"]
    )

    registerInternalServiceEventSubscriber(sharedContext, subscriber)

    const deletedIds = await this.productCategoryRepository_.delete(
      ids,
      sharedContext
    )

    // Delete are handled a bit differently since we are going to the DB directly, therefore
    // just like upsert with replace, we need to dispatch the events manually.
    if (deletedIds.length) {
      const manager = (sharedContext.transactionManager ??
        sharedContext.manager) as EntityManager
      const eventManager = manager.getEventManager()

      deletedIds.forEach((id) => {
        eventManager.dispatchEvent(EventType.afterDelete, {
          entity: { id },
          meta: {
            className: ProductCategory.name,
          } as Parameters<typeof eventManager.dispatchEvent>[2],
        })
      })
    }

    return deletedIds
  }

  @InjectTransactionManager("productCategoryRepository_")
  // @ts-expect-error
  async softDelete(
    ids: string[],
    @AcmeKitContext() sharedContext?: Context
  ): Promise<Record<string, string[]> | void> {
    return (await (
      this.productCategoryRepository_ as unknown as ProductCategoryRepository
    ).softDelete(ids, sharedContext)) as any
  }

  @InjectTransactionManager("productCategoryRepository_")
  // @ts-expect-error
  async restore(
    ids: string[],
    @AcmeKitContext() sharedContext?: Context
  ): Promise<Record<string, string[]> | void> {
    return (await (
      this.productCategoryRepository_ as unknown as ProductCategoryRepository
    ).restore(ids, sharedContext)) as any
  }
}
