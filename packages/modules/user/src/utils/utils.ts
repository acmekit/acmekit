import timespan from "jsonwebtoken/lib/timespan"

export function getExpiresAt(expiresIn: string | number) {
  const expiresAt =
    typeof expiresIn === "number"
      ? new Date(Date.now() + expiresIn * 1000)
      : new Date(Math.floor(timespan(expiresIn)) * 1000)

  return expiresAt
}
