export interface Logger {
  panic(data: unknown): void
  shouldLog(level: string): boolean
  setLogLevel(level: string): void
  unsetLogLevel(): void
  activity(message: string, config?: unknown): string
  progress(activityId: string, message: string): void
  error(messageOrError: string | Error, error?: Error): void
  failure(activityId: string, message: string): unknown
  success(activityId: string, message: string): Record<string, unknown>
  silly(message: string): void
  debug(message: string): void
  verbose(message: string): void
  http(message: string): void
  info(message: string): void
  warn(message: string): void
  log(...args: unknown[]): void
}
