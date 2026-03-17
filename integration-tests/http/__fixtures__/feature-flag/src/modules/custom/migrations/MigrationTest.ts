import { FeatureFlag, defineFileConfig } from "@medusajs/framework/utils"
import { Migration } from "@medusajs/framework/mikro-orm/migrations"

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("custom_ff"),
})

export class MigrationTest extends Migration {
  override async up(): Promise<void> {}

  override async down(): Promise<void> {}
}
