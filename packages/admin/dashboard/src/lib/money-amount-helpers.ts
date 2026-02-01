export function getStylizedAmount(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(amount)
}
