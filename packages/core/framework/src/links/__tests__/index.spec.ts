import { join } from "path"
import { LinkLoader } from "../link-loader"
import { AcmeKitModule } from "@acmekit/modules-sdk"

describe("LinkLoader", () => {
  const rootDir = join(__dirname, "../__fixtures__", "links")

  it("should register each link in the '/links' folder and sub folder", async () => {
    let links = AcmeKitModule.getCustomLinks()

    expect(links.length).toBe(0)

    await new LinkLoader(rootDir).load()

    links = AcmeKitModule.getCustomLinks()

    expect(links.length).toBe(2)
  })
})
