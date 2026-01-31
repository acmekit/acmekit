export type ToCItem = {
  title: string
  id: string
  level: number
  children?: ToCItem[]
}

export type ToCItemUi = Omit<ToCItem, "children"> & {
  children?: ToCItemUi[]
  associatedHeading: HTMLHeadingElement
}

export type Product = {
  name: string
  path: string
  title: string
  image: string
  type: "commerce"
}
