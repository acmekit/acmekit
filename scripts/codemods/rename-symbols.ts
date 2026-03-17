/**
 * ts-morph codemod: rename-symbols
 * Renames all 39 Medusa* symbols from spec Section 16.1 to AcmeKit* equivalents.
 * Usage: npx ts-node scripts/codemods/rename-symbols.ts
 */
import { Project } from 'ts-morph'

const RENAMES: Record<string, string> = {
  MedusaError: 'AcmeKitError',
  MedusaErrorTypes: 'AcmeKitErrorTypes',
  MedusaService: 'AcmeKitService',
  MedusaRequest: 'AcmeKitRequest',
  MedusaResponse: 'AcmeKitResponse',
  MedusaNextFunction: 'AcmeKitNextFunction',
  MedusaMiddlewareFunction: 'AcmeKitMiddlewareFunction',
  MedusaContainer: 'AcmeKitContainer',
  MedusaApp: 'AcmeKitApp',
  MedusaModule: 'AcmeKitModule',
  MedusaModuleType: 'AcmeKitModuleType',
  MedusaModuleConfig: 'AcmeKitModuleConfig',
  MedusaContext: 'AcmeKitContext',
  MedusaContextType: 'AcmeKitContextType',
  MedusaInternalService: 'AcmeKitInternalService',
  MedusaPlugin: 'AcmeKitPlugin',
  MedusaPluginOptions: 'AcmeKitPluginOptions',
  MedusaEvent: 'AcmeKitEvent',
  MedusaEventEmitter: 'AcmeKitEventEmitter',
  MedusaWorkflow: 'AcmeKitWorkflow',
  MedusaWorkflowOptions: 'AcmeKitWorkflowOptions',
  MedusaRepository: 'AcmeKitRepository',
  MedusaRepositoryOptions: 'AcmeKitRepositoryOptions',
  MedusaNotFoundError: 'AcmeKitNotFoundError',
  MedusaInvalidArgumentError: 'AcmeKitInvalidArgumentError',
  MedusaInvalidStateError: 'AcmeKitInvalidStateError',
  MedusaForbiddenError: 'AcmeKitForbiddenError',
  MedusaConflictError: 'AcmeKitConflictError',
  MedusaUnauthorizedError: 'AcmeKitUnauthorizedError',
  MedusaTooManyRequestsError: 'AcmeKitTooManyRequestsError',
  MedusaNotImplementedError: 'AcmeKitNotImplementedError',
  MedusaServiceHelper: 'AcmeKitServiceHelper',
  MedusaLogger: 'AcmeKitLogger',
  MedusaOAuthError: 'AcmeKitOAuthError',
  MedusaMultipartData: 'AcmeKitMultipartData',
  MedusaTestRunner: 'AcmeKitTestRunner',
  MedusaSuiteOptions: 'AcmeKitSuiteOptions',
  MedusaVitePlugin: 'AcmeKitVitePlugin',
  MedusaVitePluginOptions: 'AcmeKitVitePluginOptions',
}

async function main() {
  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    skipAddingFilesFromTsConfig: false,
  })

  let totalRenames = 0

  for (const [oldName, newName] of Object.entries(RENAMES)) {
    console.log(`Renaming ${oldName} → ${newName}...`)

    for (const sourceFile of project.getSourceFiles()) {
      const path = sourceFile.getFilePath()
      if (path.includes('node_modules') || path.includes('/dist/')) continue

      // Find class/interface/type declarations
      for (const decl of [
        ...sourceFile.getClasses(),
        ...sourceFile.getInterfaces(),
        ...sourceFile.getTypeAliases(),
        ...sourceFile.getEnums(),
        ...sourceFile.getFunctions(),
      ]) {
        if (decl.getName() === oldName) {
          decl.rename(newName)
          totalRenames++
        }
      }
    }
  }

  await project.save()
  console.log(`Done. Total renames: ${totalRenames}`)
}

main().catch(console.error)
