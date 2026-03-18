import { HttpTypes } from "@medusajs/types"
import { keepPreviousData } from "@tanstack/react-query"
import { TFunction } from "i18next"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useApiKeys,
  useCustomerGroups,
  useCustomers,
  useUsers,
} from "../../hooks/api"
import { Shortcut, ShortcutType } from "../../providers/keybind-provider"
import { useGlobalShortcuts } from "../../providers/keybind-provider/hooks"
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
  const { dynamicResults, isFetching } = useDynamicSearchResults(area, limit, q)

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

const useDynamicSearchResults = (
  currentArea: SearchArea,
  limit: number,
  q?: string
) => {
  const { t } = useTranslation()

  const debouncedSearch = useDebouncedSearch(q, 300)

  const customerResponse = useCustomers(
    {
      q: debouncedSearch,
      limit,
      fields: "id,email,first_name,last_name",
    },
    {
      enabled: isAreaEnabled(currentArea, "customer"),
      placeholderData: keepPreviousData,
    }
  )

  const customerGroupResponse = useCustomerGroups(
    {
      q: debouncedSearch,
      limit,
      fields: "id,name",
    },
    {
      enabled: isAreaEnabled(currentArea, "customerGroup"),
      placeholderData: keepPreviousData,
    }
  )

  const userResponse = useUsers(
    {
      q: debouncedSearch,
      limit,
      fields: "id,email,first_name,last_name",
    },
    {
      enabled: isAreaEnabled(currentArea, "user"),
      placeholderData: keepPreviousData,
    }
  )

  const publishableApiKeyResponse = useApiKeys(
    {
      q: debouncedSearch,
      limit,
      fields: "id,title,redacted",
      type: "publishable",
    },
    {
      enabled: isAreaEnabled(currentArea, "publishableApiKey"),
      placeholderData: keepPreviousData,
    }
  )

  const secretApiKeyResponse = useApiKeys(
    {
      q: debouncedSearch,
      limit,
      fields: "id,title,redacted",
      type: "secret",
    },
    {
      enabled: isAreaEnabled(currentArea, "secretApiKey"),
      placeholderData: keepPreviousData,
    }
  )

  const responseMap = useMemo(
    () => ({
      customer: customerResponse,
      customerGroup: customerGroupResponse,
      user: userResponse,
      publishableApiKey: publishableApiKeyResponse,
      secretApiKey: secretApiKeyResponse,
    }),
    [
      customerResponse,
      customerGroupResponse,
      userResponse,
      publishableApiKeyResponse,
      secretApiKeyResponse,
    ]
  )

  const results = useMemo(() => {
    const groups = Object.entries(responseMap)
      .map(([key, response]) => {
        const area = key as SearchArea
        if (isAreaEnabled(currentArea, area) || currentArea === "all") {
          return transformDynamicSearchResults(area, limit, t, response)
        }
        return null
      })
      .filter(Boolean) // Remove null values

    return groups
  }, [responseMap, currentArea, limit, t])

  const isAreaFetching = useCallback(
    (area: SearchArea): boolean => {
      if (area === "all") {
        return Object.values(responseMap).some(
          (response) => response.isFetching
        )
      }

      return (
        isAreaEnabled(currentArea, area) &&
        responseMap[area as keyof typeof responseMap]?.isFetching
      )
    },
    [currentArea, responseMap]
  )

  const isFetching = useMemo(() => {
    return isAreaFetching(currentArea)
  }, [currentArea, isAreaFetching])

  const dynamicResults = q
    ? (results.filter(
        (group) => !!group && group.items.length > 0
      ) as DynamicSearchResult[])
    : []

  return {
    dynamicResults,
    isFetching,
  }
}

const useDebouncedSearch = (value: string | undefined, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function isAreaEnabled(area: SearchArea, currentArea: SearchArea) {
  if (area === "all") {
    return true
  }
  if (area === currentArea) {
    return true
  }
  return false
}

type TransformMap = {
  [K in SearchArea]?: {
    dataKey: string
    transform: (item: any) => {
      id: string
      title: string
      subtitle?: string
      to: string
      value: string
      thumbnail?: string
    }
  }
}

const transformMap: TransformMap = {
  customer: {
    dataKey: "customers",
    transform: (customer: HttpTypes.AdminCustomer) => {
      const name = [customer.first_name, customer.last_name]
        .filter(Boolean)
        .join(" ")
      return {
        id: customer.id,
        title: name || customer.email,
        subtitle: name ? customer.email : undefined,
        to: `/customers/${customer.id}`,
        value: `customer:${customer.id}`,
      }
    },
  },
  customerGroup: {
    dataKey: "customer_groups",
    transform: (customerGroup: HttpTypes.AdminCustomerGroup) => ({
      id: customerGroup.id,
      title: customerGroup.name!,
      to: `/customer-groups/${customerGroup.id}`,
      value: `customerGroup:${customerGroup.id}`,
    }),
  },
  user: {
    dataKey: "users",
    transform: (user: HttpTypes.AdminUser) => ({
      id: user.id,
      title: `${user.first_name} ${user.last_name}`,
      subtitle: user.email,
      to: `/users/${user.id}`,
      value: `user:${user.id}`,
    }),
  },
  publishableApiKey: {
    dataKey: "api_keys",
    transform: (apiKey: HttpTypes.AdminApiKeyResponse["api_key"]) => ({
      id: apiKey.id,
      title: apiKey.title,
      subtitle: apiKey.redacted,
      to: `/client-api-keys/${apiKey.id}`,
      value: `publishableApiKey:${apiKey.id}`,
    }),
  },
  secretApiKey: {
    dataKey: "api_keys",
    transform: (apiKey: HttpTypes.AdminApiKeyResponse["api_key"]) => ({
      id: apiKey.id,
      title: apiKey.title,
      subtitle: apiKey.redacted,
      to: `/secret-api-keys/${apiKey.id}`,
      value: `secretApiKey:${apiKey.id}`,
    }),
  },
}

function transformDynamicSearchResults<T extends { count: number }>(
  type: SearchArea,
  limit: number,
  t: TFunction,
  response?: T
): DynamicSearchResult | undefined {
  if (!response || !transformMap[type]) {
    return undefined
  }

  const { dataKey, transform } = transformMap[type]!
  const data = response[dataKey as keyof T]

  if (!data || !Array.isArray(data)) {
    return undefined
  }

  return {
    title: t(`app.search.groups.${type}`),
    area: type,
    hasMore: response.count > limit,
    count: response.count,
    items: data.map(transform),
  }
}
