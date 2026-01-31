import { DashboardApp } from "./dashboard-app"
import { DashboardPlugin } from "./dashboard-app/types"

import displayModule from "virtual:acmekit/displays"
import formModule from "virtual:acmekit/forms"
import i18nModule from "virtual:acmekit/i18n"
import menuItemModule from "virtual:acmekit/menu-items"
import routeModule from "virtual:acmekit/routes"
import widgetModule from "virtual:acmekit/widgets"

import "./index.css"

const localPlugin = {
  widgetModule,
  routeModule,
  displayModule,
  formModule,
  menuItemModule,
  i18nModule,
}

interface AppProps {
  plugins?: DashboardPlugin[]
}

function App({ plugins = [] }: AppProps) {
  const app = new DashboardApp({
    plugins: [localPlugin, ...plugins],
  })

  return <div>{app.render()}</div>
}

export default App
