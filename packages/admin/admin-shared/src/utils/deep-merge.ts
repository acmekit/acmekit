import { isObject } from "./is-object"

export function deepMerge(target: any, source: any) {
    const recursive = (a:any, b:any) => {
        if (!isObject(a)) {
            return b
        }
        if (!isObject(b)) {
            return a
        }

        Object.keys(b).forEach((key) => {
            if (isObject((b as any)[key])) {
                (a as any)[key] ??= {};
                (a as any)[key] = deepMerge((a as any)[key], (b as any)[key])
            } else {
                (a as any)[key] = (b as any)[key]
            }
        })

        return a
    }

    const copy = { ...target }
    return recursive(copy, source)
}
