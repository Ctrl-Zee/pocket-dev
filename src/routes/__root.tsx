import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { PocketDevDevice } from '@/features/pocket-dev/Device'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <PocketDevDevice>
      <Outlet />
    </PocketDevDevice>
  )
}
