import { QueryClient } from "@tanstack/react-query"

export const ACMEKIT_BACKEND_URL = __BACKEND_URL__ ?? "/"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 90000,
      retry: 1,
    },
  },
})
