import { setTimeout } from "timers/promises"

export async function fetchAndRetry(
  func: () => Promise<any>,
  validation?: (data: any) => boolean,
  {
    retries = 3,
    waitSeconds = 1,
  }: {
    retries?: number
    waitSeconds?: number
  } = {}
) {
  while (retries >= 0) {
    try {
      const res = await func()

      if (validation && !validation(res)) {
        throw new Error("Validation failed. Retry...")
      }

      return res
    } catch (err) {
      if (retries > 0) {
        retries--
        await setTimeout(waitSeconds * 1000)
        continue
      }
      throw err
    }
  }
}
