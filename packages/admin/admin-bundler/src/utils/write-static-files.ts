import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import outdent from "outdent"

export async function writeStaticFiles(plugins?: string[]) {
  const outDir = join(process.cwd(), ".acmekit/client")

  await mkdir(outDir, { recursive: true })

  const promises = [
    writeCSSFile(outDir),
    writeEntryFile(outDir, plugins),
    writeHTMLFile(outDir),
  ]

  await Promise.all(promises)
}

async function writeCSSFile(outDir: string) {
  const css = outdent`
    @import "@acmekit/dashboard/css";

    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  await writeFile(join(outDir, "index.css"), css)
}

function getPluginName(index: number) {
  return `plugin${index}`
}

async function writeEntryFile(outDir: string, plugins?: string[]) {
  const pluginsList = plugins ?? []
  const entry = outdent`
    import App from "@acmekit/dashboard";
    import React from "react";
    import ReactDOM from "react-dom/client";
    import "./index.css";

    ${pluginsList
      .map((plugin, idx) => `import ${getPluginName(idx)} from "${plugin}"`)
      .join("\n")}

    let root = null

    if (!root) {
      root = ReactDOM.createRoot(document.getElementById("acmekit"))
    }

    
    root.render(
      <React.StrictMode>
        <App plugins={[${pluginsList
          .map((_, idx) => getPluginName(idx))
          .join(", ")}]} />
      </React.StrictMode>
    )


    if (import.meta.hot) {
        import.meta.hot.accept()
    }
  `

  await writeFile(join(outDir, "entry.jsx"), entry)
}

async function writeHTMLFile(outDir: string) {
  const html = outdent`
    <!DOCTYPE html>
    <html>
        <head>
            <meta
                http-equiv="Content-Type"
                content="text/html; charset=UTF-8"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, user-scalable=no"
            />
            <link rel="icon" href="data:," data-placeholder-favicon />
        </head>

        <body>
            <div id="acmekit"></div>
            <script type="module" src="./entry.jsx"></script>
        </body>
    </html>
  `

  await writeFile(join(outDir, "index.html"), html)
}
