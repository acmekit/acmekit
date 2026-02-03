# Module Links

A module link forms an association between two data models of different modules, while maintaining module isolation.

> Learn more about links in [this documentation](https://docs.acmekitjs.com/learn/fundamentals/module-links)

For example:

```ts
import BlogModule from "../modules/blog"
import ProductModule from "@acmekit/acmekit/product"
import { defineLink } from "@acmekit/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  BlogModule.linkable.post
)
```

This defines a link between the Product Module's `product` data model and the Blog Module (custom module)'s `post` data model.

Then, in the Acmekit application, run the following command to sync the links to the database:

```bash
npx acmekit db:migrate
```