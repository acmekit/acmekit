import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useGlobalShortcuts } from "../../providers/keybind-provider"
import { Shortcut, ShortcutType } from "../../providers/keybind-provider"
import { DynamicSearchResult, SearchArea } from "./types"

type UseSearchProps = {
  q?: string
  limit: number
  area?: SearchArea
}

export const useSearchResults = ({
  q,
  limit,
  area = "all",
}: UseSearchProps) => {
  const staticResults = useStaticSearchResults(area)
  const { dynamicResults, isFetching } = useDynamicSearchResults(
    area,
    limit,
    q
  )

  return {
    staticResults,
    dynamicResults,
    isFetching,
  }
}

const useStaticSearchResults = (currentArea: SearchArea) => {
  const globalCommands = useGlobalShortcuts()

  const results = useMemo(() => {
    const groups = new Map<ShortcutType, Shortcut[]>()

    globalCommands.forEach((command) => {
      const group = groups.get(command.type) || []
      group.push(command)
      groups.set(command.type, group)
    })

    let filteredGroups: [ShortcutType, Shortcut[]][]

    switch (currentArea) {
      case "all":
        filteredGroups = Array.from(groups)
        break
      case "navigation":
        filteredGroups = Array.from(groups).filter(
          ([type]) => type === "pageShortcut" || type === "settingShortcut"
        )
        break
      case "command":
        filteredGroups = Array.from(groups).filter(
          ([type]) => type === "commandShortcut"
        )
        break
      default:
        filteredGroups = []
    }

    return filteredGroups.map(([title, items]) => ({
      title,
      items,
    }))
  }, [globalCommands, currentArea])

  return results
}

/**
 * Dynamic search results (entity search). By default returns empty;
 * plugins can extend search to register their own entity types.
 */
const useDynamicSearchResults = (
  _currentArea: SearchArea,
  _limit: number,
  _q?: string
) => {
  return useMemo(
    () => ({
      dynamicResults: [] as DynamicSearchResult[],
      isFetching: false,
    }),
    []
  )
}
