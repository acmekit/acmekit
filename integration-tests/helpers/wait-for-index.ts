/**
 * Helper functions to wait for index synchronization in a deterministic way
 * by directly checking the index_data table instead of using arbitrary timeouts.
 */

export interface WaitForIndexOptions {
  timeout?: number
  pollInterval?: number
  isLink?: boolean
}

/**
 * Wait for specific entities to be indexed by checking the index_data table directly.
 * Since index_data is a partitioned table, rows present in index_data are automatically
 * visible in the correct partition — no separate partition check is needed.
 */
export async function waitForIndexedEntities(
  dbConnection: any,
  entityName: string,
  entityIds: string[],
  options: WaitForIndexOptions = {}
): Promise<void> {
  const { timeout = 90000, pollInterval = 250 } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    try {
      const result = await dbConnection.raw(
        `SELECT id FROM index_data WHERE id = ANY(?) AND staled_at IS NULL`,
        [entityIds]
      )

      const indexedIds = result.rows
        ? result.rows.map((row: any) => row.id)
        : result.map((row: any) => row.id)

      if (entityIds.every((id) => indexedIds.includes(id))) {
        return
      }
    } catch (error) {
      // ignore transient errors and retry
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval))
  }

  console.error(
    `Entities [${entityIds.join(", ")}] of type '${entityName}' were not indexed within ${timeout}ms`
  )
}
