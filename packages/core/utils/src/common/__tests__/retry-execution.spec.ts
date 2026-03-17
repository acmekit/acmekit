import { retryExecution } from "../retry-execution"
import { setTimeout } from "timers/promises"

// Mock setTimeout to avoid waiting in tests
jest.mock("timers/promises", () => ({
  setTimeout: jest.fn().mockResolvedValue(undefined),
}))

describe("retryExecution", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return the result of the function on the first try", async () => {
    const fn = jest.fn().mockResolvedValue("success")
    const result = await retryExecution(fn, {
      maxRetries: 3,
      retryDelay: 100,
      shouldRetry: () => true,
    })

    expect(result).toBe("success")
    expect(fn).toHaveBeenCalledTimes(1)
    expect(setTimeout).not.toHaveBeenCalled()
  })

  it("should retry the function and succeed", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("failure"))
      .mockRejectedValueOnce(new Error("failure"))
      .mockResolvedValue("success")

    const result = await retryExecution(fn, {
      maxRetries: 3,
      retryDelay: 100,
      shouldRetry: () => true,
    })

    expect(result).toBe("success")
    expect(fn).toHaveBeenCalledTimes(3)
    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(setTimeout).toHaveBeenCalledWith(100)
  })

  it("should throw an error after max retries", async () => {
    const error = new Error("failure")
    const fn = jest.fn().mockRejectedValue(error)
    const maxRetries = 3

    await expect(
      retryExecution(fn, {
        maxRetries,
        retryDelay: 100,
        shouldRetry: () => true,
      })
    ).rejects.toThrow(error)

    expect(fn).toHaveBeenCalledTimes(maxRetries)
    expect(setTimeout).toHaveBeenCalledTimes(maxRetries - 1)
  })

  it("should not retry if shouldRetry returns false", async () => {
    const error = new Error("non-retryable error")
    const fn = jest.fn().mockRejectedValue(error)
    const shouldRetry = jest.fn().mockReturnValue(false)

    await expect(
      retryExecution(fn, {
        maxRetries: 3,
        retryDelay: 100,
        shouldRetry,
      })
    ).rejects.toThrow(error)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(shouldRetry).toHaveBeenCalledWith(error)
    expect(setTimeout).not.toHaveBeenCalled()
  })

  it("should use default options if none are provided", async () => {
    const error = new Error("failure")
    const fn = jest.fn().mockRejectedValue(error)

    await expect(retryExecution(fn)).rejects.toThrow(error)

    // Default maxRetries is 5
    expect(fn).toHaveBeenCalledTimes(5)
    // Default retryDelay is 1000
    expect(setTimeout).toHaveBeenCalledTimes(4)
    expect(setTimeout).toHaveBeenCalledWith(1000)
  })

  it("should handle async functions correctly", async () => {
    const asyncFn = jest.fn(async () => {
      await new Promise((resolve) => setImmediate(resolve))
      return "async success"
    })

    const result = await retryExecution(asyncFn, {
      maxRetries: 3,
      retryDelay: 100,
      shouldRetry: () => true,
    })

    expect(result).toBe("async success")
    expect(asyncFn).toHaveBeenCalledTimes(1)
  })

  it("should retry an async function and succeed", async () => {
    const asyncFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("failure"))
      .mockResolvedValue("async success")

    const result = await retryExecution(asyncFn, {
      maxRetries: 3,
      retryDelay: 100,
      shouldRetry: () => true,
    })

    expect(result).toBe("async success")
    expect(asyncFn).toHaveBeenCalledTimes(2)
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  it("should use a function for retryDelay if provided", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("failure"))
      .mockRejectedValueOnce(new Error("failure"))
      .mockResolvedValue("success")

    const retryDelayFn = jest.fn((retries, maxRetries) => {
      return retries * 50
    })

    const result = await retryExecution(fn, {
      maxRetries: 3,
      retryDelay: retryDelayFn,
      shouldRetry: () => true,
    })

    expect(result).toBe("success")
    expect(fn).toHaveBeenCalledTimes(3)
    expect(retryDelayFn).toHaveBeenCalledTimes(2)
    expect(retryDelayFn).toHaveBeenCalledWith(1, 3)
    expect(retryDelayFn).toHaveBeenCalledWith(2, 3)
    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(setTimeout).toHaveBeenNthCalledWith(1, 50)
    expect(setTimeout).toHaveBeenNthCalledWith(2, 100)
  })

  it("should throw the final error if maxRetries is 0", async () => {
    const fn = jest.fn().mockResolvedValue("success")
    const maxRetries = 0

    await expect(
      retryExecution(fn, {
        maxRetries,
        retryDelay: 100,
        shouldRetry: () => true,
      })
    ).rejects.toThrow("Retry execution failed. Max retries reached.")

    expect(fn).not.toHaveBeenCalled()
  })
})
