import { Context, LoadedModule, AcmeKitContainer } from "@acmekit/types"
import {
  createAcmeKitContainer,
  isDefined,
  isString,
  AcmeKitContext,
  AcmeKitContextType,
  AcmeKitError,
  AcmeKitModuleType,
} from "@acmekit/utils"
import { asValue } from "@acmekit/deps/awilix"
import {
  DistributedTransactionEvent,
  DistributedTransactionEvents,
  DistributedTransactionType,
  TransactionFlow,
  TransactionModelOptions,
  TransactionOrchestrator,
  TransactionStepsDefinition,
} from "../transaction"
import { OrchestratorBuilder } from "../transaction/orchestrator-builder"
import {
  WorkflowDefinition,
  WorkflowManager,
  WorkflowStepHandler,
} from "./workflow-manager"

type StepHandler = {
  invoke: WorkflowStepHandler
  compensate?: WorkflowStepHandler
}

export class LocalWorkflow {
  protected container_: AcmeKitContainer
  protected workflowId: string
  protected flow: OrchestratorBuilder
  protected customOptions: Partial<TransactionModelOptions> = {}
  protected workflow: WorkflowDefinition
  protected handlers: Map<string, StepHandler>
  protected acmekitContext?: Context

  get container(): AcmeKitContainer {
    return this.container_
  }

  set container(modulesLoaded: LoadedModule[] | AcmeKitContainer) {
    this.resolveContainer(modulesLoaded)
  }

  constructor(
    workflowId: string,
    modulesLoaded?: LoadedModule[] | AcmeKitContainer
  ) {
    const globalWorkflow = WorkflowManager.getWorkflow(workflowId)
    if (!globalWorkflow) {
      throw new AcmeKitError(
        AcmeKitError.Types.NOT_FOUND,
        `Workflow with id "${workflowId}" not found.`
      )
    }

    const workflow = {
      ...globalWorkflow,
      orchestrator: TransactionOrchestrator.clone(globalWorkflow.orchestrator),
    }

    this.flow = new OrchestratorBuilder(workflow.flow_)
    this.workflowId = workflowId
    this.workflow = workflow
    this.handlers = new Map(workflow.handlers_)

    this.resolveContainer(modulesLoaded)
  }

  private resolveContainer(modulesLoaded?: LoadedModule[] | AcmeKitContainer) {
    let container

    if (!Array.isArray(modulesLoaded) && modulesLoaded) {
      if (!("cradle" in modulesLoaded)) {
        container = createAcmeKitContainer(modulesLoaded)
      } else {
        container = createAcmeKitContainer({}, modulesLoaded) // copy container
      }
    } else if (Array.isArray(modulesLoaded) && modulesLoaded.length) {
      container = createAcmeKitContainer()

      for (const mod of modulesLoaded || []) {
        const keyName = mod.__definition.key
        container.register(keyName, asValue(mod))
      }
    }

    this.container_ = this.contextualizedAcmeKitModules(container)
  }

  private contextualizedAcmeKitModules(container) {
    if (!container) {
      return createAcmeKitContainer()
    }

    // eslint-disable-next-line
    const this_ = this
    const originalResolver = container.resolve
    container.resolve = function (keyName, opts) {
      const resolved = originalResolver(keyName, opts)
      if (resolved?.constructor?.__type !== AcmeKitModuleType) {
        return resolved
      }

      return new Proxy(resolved, {
        get: function (target, prop) {
          if (typeof target[prop] !== "function") {
            return target[prop]
          }

          return (...args) => {
            const ctxIndex = AcmeKitContext.getIndex(target, prop as string)

            const hasContext = args[ctxIndex!]?.__type === AcmeKitContextType
            if (!hasContext && isDefined(ctxIndex)) {
              const context = this_.acmekitContext
              if (context?.__type === AcmeKitContextType) {
                delete context?.manager
                delete context?.transactionManager

                args[ctxIndex] = context
              }
            }

            const method = target[prop]
            return method.apply(target, [...args])
          }
        },
      })
    }

    return container
  }

  protected commit() {
    const finalFlow = this.flow.build()

    const globalWorkflow = WorkflowManager.getWorkflow(this.workflowId)
    const customOptions = {
      ...globalWorkflow?.options,
      ...this.customOptions,
    }

    this.workflow = {
      id: this.workflowId,
      flow_: finalFlow,
      orchestrator: new TransactionOrchestrator({
        id: this.workflowId,
        definition: finalFlow,
        options: customOptions,
      }),
      options: customOptions,
      handler: WorkflowManager.buildHandlers(this.handlers),
      handlers_: this.handlers,
    }
  }

  public getFlow() {
    if (this.flow.hasChanges) {
      this.commit()
    }

    return this.workflow.flow_
  }

  private registerEventCallbacks({
    orchestrator,
    transaction,
    subscribe,
    idempotencyKey,
  }: {
    orchestrator: TransactionOrchestrator
    transaction?: DistributedTransactionType
    subscribe?: DistributedTransactionEvents
    idempotencyKey?: string
  }) {
    const modelId = orchestrator.id
    let transactionId

    if (transaction) {
      transactionId = transaction!.transactionId
    } else if (idempotencyKey) {
      const [, trxId] = idempotencyKey!.split(":")
      transactionId = trxId
    }

    const eventWrapperMap = new Map()
    for (const [key, handler] of Object.entries(subscribe ?? {})) {
      eventWrapperMap.set(key, (args) => {
        const { transaction } = args

        if (
          transaction.transactionId !== transactionId ||
          transaction.modelId !== modelId
        ) {
          return
        }

        handler(args)
      })
    }

    if (subscribe?.onBegin) {
      orchestrator.on(
        DistributedTransactionEvent.BEGIN,
        eventWrapperMap.get("onBegin")
      )
    }

    if (subscribe?.onResume) {
      orchestrator.on(
        DistributedTransactionEvent.RESUME,
        eventWrapperMap.get("onResume")
      )
    }

    if (subscribe?.onCompensateBegin) {
      orchestrator.on(
        DistributedTransactionEvent.COMPENSATE_BEGIN,
        eventWrapperMap.get("onCompensateBegin")
      )
    }

    if (subscribe?.onTimeout) {
      orchestrator.on(
        DistributedTransactionEvent.TIMEOUT,
        eventWrapperMap.get("onTimeout")
      )
    }

    if (subscribe?.onFinish) {
      orchestrator.on(
        DistributedTransactionEvent.FINISH,
        eventWrapperMap.get("onFinish")
      )
    }

    const resumeWrapper = ({ transaction }) => {
      if (
        transaction.modelId !== modelId ||
        transaction.transactionId !== transactionId
      ) {
        return
      }

      if (subscribe?.onStepBegin) {
        transaction.on(
          DistributedTransactionEvent.STEP_BEGIN,
          eventWrapperMap.get("onStepBegin")
        )
      }

      if (subscribe?.onStepSuccess) {
        transaction.on(
          DistributedTransactionEvent.STEP_SUCCESS,
          eventWrapperMap.get("onStepSuccess")
        )
      }

      if (subscribe?.onStepFailure) {
        transaction.on(
          DistributedTransactionEvent.STEP_FAILURE,
          eventWrapperMap.get("onStepFailure")
        )
      }

      if (subscribe?.onStepAwaiting) {
        transaction.on(
          DistributedTransactionEvent.STEP_AWAITING,
          eventWrapperMap.get("onStepAwaiting")
        )
      }

      if (subscribe?.onCompensateStepSuccess) {
        transaction.on(
          DistributedTransactionEvent.COMPENSATE_STEP_SUCCESS,
          eventWrapperMap.get("onCompensateStepSuccess")
        )
      }

      if (subscribe?.onCompensateStepFailure) {
        transaction.on(
          DistributedTransactionEvent.COMPENSATE_STEP_FAILURE,
          eventWrapperMap.get("onCompensateStepFailure")
        )
      }

      if (subscribe?.onStepSkipped) {
        transaction.on(
          DistributedTransactionEvent.STEP_SKIPPED,
          eventWrapperMap.get("onStepSkipped")
        )
      }
    }

    if (transaction) {
      resumeWrapper({ transaction })
    } else {
      orchestrator.once("resume", resumeWrapper)
    }

    const cleanUp = () => {
      subscribe?.onFinish &&
        orchestrator.removeListener(
          DistributedTransactionEvent.FINISH,
          eventWrapperMap.get("onFinish")
        )
      subscribe?.onResume &&
        orchestrator.removeListener(
          DistributedTransactionEvent.RESUME,
          eventWrapperMap.get("onResume")
        )
      subscribe?.onBegin &&
        orchestrator.removeListener(
          DistributedTransactionEvent.BEGIN,
          eventWrapperMap.get("onBegin")
        )
      subscribe?.onCompensateBegin &&
        orchestrator.removeListener(
          DistributedTransactionEvent.COMPENSATE_BEGIN,
          eventWrapperMap.get("onCompensateBegin")
        )
      subscribe?.onTimeout &&
        orchestrator.removeListener(
          DistributedTransactionEvent.TIMEOUT,
          eventWrapperMap.get("onTimeout")
        )

      orchestrator.removeListener(
        DistributedTransactionEvent.RESUME,
        resumeWrapper
      )

      eventWrapperMap.clear()
    }

    return {
      cleanUpEventListeners: cleanUp,
    }
  }

  async run(
    uniqueTransactionId: string,
    input?: unknown,
    context?: Context,
    subscribe?: DistributedTransactionEvents,
    flowMetadata?: TransactionFlow["metadata"]
  ) {
    if (this.flow.hasChanges) {
      this.commit()
    }
    this.acmekitContext = context
    const { handler, orchestrator } = this.workflow

    const transaction = await orchestrator.beginTransaction({
      transactionId: uniqueTransactionId,
      handler: handler(this.container_, context),
      payload: input,
      flowMetadata,
      context,
      onLoad: this.onLoad.bind(this),
    })

    const { cleanUpEventListeners } = this.registerEventCallbacks({
      orchestrator,
      transaction,
      subscribe,
    })

    await orchestrator.resume(transaction)

    try {
      return transaction
    } finally {
      cleanUpEventListeners()
    }
  }

  async getRunningTransaction(uniqueTransactionId: string, context?: Context) {
    this.acmekitContext = context
    const { handler, orchestrator } = this.workflow

    const transaction = await orchestrator.retrieveExistingTransaction(
      uniqueTransactionId,
      handler(this.container_, context),
      { isCancelling: context?.isCancelling }
    )

    return transaction
  }

  async cancel(
    transactionOrTransactionId: string | DistributedTransactionType,
    _?: unknown, // not used but a common argument on other methods called dynamically
    context?: Context,
    subscribe?: DistributedTransactionEvents
  ) {
    this.acmekitContext = context
    const { orchestrator } = this.workflow

    let transaction = isString(transactionOrTransactionId)
      ? await this.getRunningTransaction(transactionOrTransactionId, context)
      : transactionOrTransactionId

    // not a distributed transaction instance
    if (!transaction.getFlow) {
      transaction = await this.getRunningTransaction(
        (transaction as any).flow.transactionId,
        context
      )
    }

    if (this.acmekitContext) {
      this.acmekitContext.eventGroupId =
        transaction.getFlow().metadata!.eventGroupId
      transaction.getFlow().metadata!.cancelingFromParentStep ??=
        this.acmekitContext.cancelingFromParentStep
    }

    const { cleanUpEventListeners } = this.registerEventCallbacks({
      orchestrator,
      transaction,
      subscribe,
    })

    await orchestrator.cancelTransaction(transaction)

    try {
      return transaction
    } finally {
      cleanUpEventListeners()
    }
  }

  async retryStep(
    idempotencyKey: string,
    context?: Context,
    subscribe?: DistributedTransactionEvents
  ): Promise<DistributedTransactionType> {
    this.acmekitContext = context
    const { handler, orchestrator } = this.workflow

    const { cleanUpEventListeners } = this.registerEventCallbacks({
      orchestrator,
      idempotencyKey,
      subscribe,
    })

    const transaction = await orchestrator.retryStep({
      responseIdempotencyKey: idempotencyKey,
      handler: handler(this.container_, context),
      onLoad: this.onLoad.bind(this),
    })

    try {
      return transaction
    } finally {
      cleanUpEventListeners()
    }
  }

  async registerStepSuccess(
    idempotencyKey: string,
    response?: unknown,
    context?: Context,
    subscribe?: DistributedTransactionEvents
  ): Promise<DistributedTransactionType> {
    this.acmekitContext = context
    const { handler, orchestrator } = this.workflow

    const { cleanUpEventListeners } = this.registerEventCallbacks({
      orchestrator,
      idempotencyKey,
      subscribe,
    })

    const transaction = await orchestrator.registerStepSuccess({
      responseIdempotencyKey: idempotencyKey,
      handler: handler(this.container_, context),
      response,
      onLoad: this.onLoad.bind(this),
    })

    try {
      return transaction
    } finally {
      cleanUpEventListeners()
    }
  }

  async registerStepFailure(
    idempotencyKey: string,
    error?: Error | any,
    context?: Context,
    subscribe?: DistributedTransactionEvents,
    forcePermanentFailure?: boolean
  ): Promise<DistributedTransactionType> {
    this.acmekitContext = context
    const { handler, orchestrator } = this.workflow

    const { cleanUpEventListeners } = this.registerEventCallbacks({
      orchestrator,
      idempotencyKey,
      subscribe,
    })

    const transaction = await orchestrator.registerStepFailure({
      responseIdempotencyKey: idempotencyKey,
      error,
      handler: handler(this.container_, context),
      onLoad: this.onLoad.bind(this),
      forcePermanentFailure,
    })

    try {
      return transaction
    } finally {
      cleanUpEventListeners()
    }
  }

  setOptions(options: Partial<TransactionModelOptions>) {
    this.customOptions = options
    return this
  }

  addAction(
    action: string,
    handler: StepHandler,
    options: Partial<TransactionStepsDefinition> = {}
  ) {
    this.assertHandler(handler, action)
    this.handlers.set(action, handler)

    return this.flow.addAction(action, options)
  }

  replaceAction(
    existingAction: string,
    action: string,
    handler: StepHandler,
    options: Partial<TransactionStepsDefinition> = {}
  ) {
    this.assertHandler(handler, action)
    this.handlers.set(action, handler)

    return this.flow.replaceAction(existingAction, action, options)
  }

  insertActionBefore(
    existingAction: string,
    action: string,
    handler: StepHandler,
    options: Partial<TransactionStepsDefinition> = {}
  ) {
    this.assertHandler(handler, action)
    this.handlers.set(action, handler)

    return this.flow.insertActionBefore(existingAction, action, options)
  }

  insertActionAfter(
    existingAction: string,
    action: string,
    handler: StepHandler,
    options: Partial<TransactionStepsDefinition> = {}
  ) {
    this.assertHandler(handler, action)
    this.handlers.set(action, handler)

    return this.flow.insertActionAfter(existingAction, action, options)
  }

  appendAction(
    action: string,
    to: string,
    handler: StepHandler,
    options: Partial<TransactionStepsDefinition> = {}
  ) {
    this.assertHandler(handler, action)
    this.handlers.set(action, handler)

    return this.flow.appendAction(action, to, options)
  }

  moveAction(actionToMove: string, targetAction: string): OrchestratorBuilder {
    return this.flow.moveAction(actionToMove, targetAction)
  }

  moveAndMergeNextAction(
    actionToMove: string,
    targetAction: string
  ): OrchestratorBuilder {
    return this.flow.moveAndMergeNextAction(actionToMove, targetAction)
  }

  mergeActions(where: string, ...actions: string[]) {
    return this.flow.mergeActions(where, ...actions)
  }

  deleteAction(action: string, parentSteps?) {
    return this.flow.deleteAction(action, parentSteps)
  }

  pruneAction(action: string) {
    return this.flow.pruneAction(action)
  }

  protected assertHandler(handler: StepHandler, action: string): void | never {
    if (!handler?.invoke) {
      throw new Error(
        `Handler for action "${action}" is missing invoke function.`
      )
    }
  }

  private onLoad(transaction: DistributedTransactionType) {
    if (this.acmekitContext) {
      const flow = transaction.getFlow() ?? {}
      const metadata = (flow.metadata ??
        {}) as Required<TransactionFlow>["metadata"]
      this.acmekitContext.eventGroupId = metadata.eventGroupId
      this.acmekitContext.parentStepIdempotencyKey =
        metadata.parentStepIdempotencyKey
      this.acmekitContext.preventReleaseEvents = metadata?.preventReleaseEvents
      this.acmekitContext.cancelingFromParentStep =
        metadata?.cancelingFromParentStep
    }
  }
}
