# AcmeKit Core

Open-source commerce platform. TypeScript monorepo with 30+ modular commerce packages.

### 1. Codebase Structure

**Monorepo Organization:**
```
/packages/
├── acmekit/              # Main AcmeKit package
├── core/                # Core framework packages
│   ├── framework/       # Core runtime
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Utilities
│   ├── workflows-sdk/   # Workflow composition
│   ├── core-flows/      # Predefined workflows
│   └── modules-sdk/     # Module development
├── modules/             # 30+ commerce modules
│   ├── product/, order/, cart/, payment/...
│   └── providers/       # 15+ provider implementations
├── admin/               # Dashboard packages
│   └── dashboard/       # React admin UI
├── cli/                 # CLI tools
└── design-system/       # UI components
/integration-tests/      # Full-stack tests
/www/                    # Documentation site
```

**Key Directories:**
- `packages/core/framework/` - Core runtime, HTTP, database
- `packages/acmekit/src/api/` - API routes
- `packages/modules/` - Commerce feature modules
- `packages/admin/dashboard/` - Admin React app

### 2. Build System & Commands

**Package Manager**: Yarn 3.2.1 with node-modules linker

**Essential Commands:**
```bash
# Install dependencies
yarn install
# Build all packages
yarn build
# Build specific package
yarn workspace @acmekit/acmekit build
# Watch mode (in package directory)
yarn watch
```

**Testing Commands:**
```bash
# All unit tests
yarn test
# Package integration tests
yarn test:integration:packages
# HTTP integration tests
yarn test:integration:http
# API integration tests
yarn test:integration:api
# Module integration tests
yarn test:integration:modules
```

### 3. Testing Conventions

**Frameworks:**
- Jest 29.7.0 (backend/core)
- Vitest 3.0.5 (admin/frontend)

**Test Locations:**
- Unit tests: `__tests__/` directories alongside source
- Package integration tests: `packages/*/integration-tests/__tests__/`
- HTTP integration tests: `integration-tests/http/__tests__/`

**Patterns:**
- File extension: `.spec.ts` or `.test.ts`
- Unit test structure: `describe/it` blocks
- Integration tests: Use custom test runners with DB setup

### 4. Code Style Conventions

**Formatting (Prettier):**
- No semicolons
- Double quotes
- 2 space indentation
- ES5 trailing commas
- Always use parens in arrow functions

**TypeScript:**
- Target: ES2021
- Module: Node16
- Strict null checks enabled
- Decorators enabled (experimental)

**Naming Conventions:**
- Files: kebab-case (`define-config.ts`)
- Types/Interfaces/Classes: PascalCase
- Functions/Variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- DB fields: snake_case

**Export Patterns:**
- Barrel exports via `export * from`
- Named re-exports for specific items

### 5. Architecture Patterns

#### 5.1 Module Pattern - Services with Decorators

**Service Structure:**
- Extend `AcmeKitService<T>` with typed model definitions
- Inject dependencies via constructor
- Use decorators for cross-cutting concerns

**Key Decorators:**
- `@InjectManager()` - Inject entity manager (use on public methods)
- `@InjectTransactionManager()` - Inject transaction manager (use on protected methods)
- `@AcmeKitContext()` - Inject shared context as parameter
- `@EmitEvents()` - Emit domain events after operation

**Example:**
```typescript
export class OrderModuleService
  extends AcmeKitService<{ Order: { dto: OrderDTO } }>({ Order })
  implements IOrderModuleService
{
  @InjectManager()
  @EmitEvents()
  async deleteOrders(
    ids: string[],
    @AcmeKitContext() sharedContext: Context = {}
  ) {
    return await this.deleteOrders_(ids, sharedContext)
  }

  @InjectTransactionManager()
  protected async deleteOrders_(
    ids: string[],
    @AcmeKitContext() sharedContext: Context = {}
  ) {
    await this.orderService_.softDelete(ids, sharedContext)
  }
}
```

**Reference Files:**
- `packages/modules/order/src/services/order-module-service.ts`
- `packages/modules/api-key/src/services/api-key-module-service.ts`

#### 5.2 API Route Pattern

**Route Structure:**
- Named exports for HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
- Type request: `AuthenticatedAcmeKitRequest<T>` or `AcmeKitRequest<T>`
- Type response: `AcmeKitResponse<T>`
- Access dependencies from `req.scope`
- Use workflows from `@acmekit/core-flows`

**Example:**
```typescript
import { deleteOrderWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminOrderDeleteResponse>
) => {
  const { id } = req.params

  await deleteOrderWorkflow(req.scope).run({
    input: { id },
  })

  res.status(200).json({
    id,
    object: "order",
    deleted: true,
  })
}
```

**Common Patterns:**
- Filters: `req.filterableFields`
- Pagination: `req.queryConfig.pagination`
- Fields: `req.queryConfig.fields`
- Resolve services: `req.scope.resolve(ContainerRegistrationKeys.QUERY)`

**Reference Files:**
- `packages/acmekit/src/api/admin/orders/route.ts`
- `packages/acmekit/src/api/admin/payment-collections/[id]/route.ts`

#### 5.3 Workflow Pattern

**Step Definition:**
- Create steps with `createStep(id, mainAction, compensationAction?)`
- Return `StepResponse(result, compensationData)`
- Compensation function handles rollback

**Workflow Composition:**
- Create workflows with `createWorkflow(id, function)`
- Use `WorkflowData<T>` for typed input
- Return `WorkflowResponse<T>` for typed output
- Chain steps, use `transform()`, `when()`, `parallelize()`
- Query data with `useQueryGraphStep()`
- Emit events with `createHook()`

**Example Step:**
```typescript
export const deletePromotionsStep = createStep(
  "delete-promotions",
  async (ids: string[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )
    await promotionModule.softDeletePromotions(ids)
    return new StepResponse(void 0, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) return
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )
    await promotionModule.restorePromotions(idsToRestore)
  }
)
```

**Example Workflow:**
```typescript
export const deletePromotionsWorkflow = createWorkflow(
  "delete-promotions",
  (input: WorkflowData<{ ids: string[] }>) => {
    const deletedPromotions = deletePromotionsStep(input.ids)
    const promotionsDeleted = createHook("promotionsDeleted", {
      ids: input.ids,
    })
    return new WorkflowResponse(deletedPromotions, {
      hooks: [promotionsDeleted],
    })
  }
)
```

**Reference Files:**
- `packages/core/core-flows/src/promotion/steps/delete-promotions.ts`
- `packages/core/core-flows/src/promotion/workflows/delete-promotions.ts`
- `packages/core/core-flows/src/order/workflows/update-order.ts`

#### 5.4 Error Handling

**AcmeKitError Pattern:**
- Use `new AcmeKitError(type, message)` for all error throwing
- Provide contextual, user-friendly error messages
- Validate inputs early in services and workflow steps

**Common Error Types:**
- `AcmeKitError.Types.NOT_FOUND` - Resource not found
- `AcmeKitError.Types.INVALID_DATA` - Invalid input or state
- `AcmeKitError.Types.NOT_ALLOWED` - Operation not permitted

**Example:**
```typescript
import { AcmeKitError, validateEmail } from "@acmekit/framework/utils"

// In service
if (!entity) {
  throw new AcmeKitError(
    AcmeKitError.Types.NOT_FOUND,
    `Order with id: ${id} was not found`
  )
}

// In workflow step
if (input.email) {
  validateEmail(input.email)
}

if (order.status === "cancelled") {
  throw new AcmeKitError(
    AcmeKitError.Types.NOT_ALLOWED,
    "Cannot update a cancelled order"
  )
}
```

**Reference Files:**
- `packages/core/utils/src/modules-sdk/acmekit-internal-service.ts`
- `packages/core/core-flows/src/order/workflows/update-order.ts`

#### 5.5 Common Import Patterns

**Path Aliases (configured in tsconfig.json):**
- `@models` - Entity models
- `@types` - DTO and type definitions
- `@services` - Service dependencies
- `@repositories` - Data access layer
- `@utils` - Utility functions

**Framework Imports:**
```typescript
// Utils and decorators
import {
  InjectManager,
  InjectTransactionManager,
  AcmeKitContext,
  AcmeKitError,
  AcmeKitService,
  EmitEvents,
  Modules,
} from "@acmekit/framework/utils"

// Types
import type {
  Context,
  DAL,
  IOrderModuleService,
} from "@acmekit/framework/types"

// Workflows
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@acmekit/framework/workflows-sdk"

// Core flows
import { deleteOrderWorkflow } from "@acmekit/core-flows"

// HTTP
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
```
