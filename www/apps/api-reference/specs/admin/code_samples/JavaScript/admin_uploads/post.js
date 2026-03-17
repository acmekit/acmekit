import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.upload.create(
  {
    files: [
       // file uploaded as a binary string
      {
        name: "test.txt",
        content: "test", // Should be the binary string of the file
      },
      // file uploaded as a File object
      new File(["test"], "test.txt", { type: "text/plain" })
    ],
  }
)
.then(({ files }) => {
  console.log(files)
})