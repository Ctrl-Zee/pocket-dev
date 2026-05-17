import { createRootRoute, Outlet } from '@tanstack/react-router'
import { PocketDevDevice } from '@/features/pocket-dev/Device'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <PocketDevDevice>
      <Outlet />
    </PocketDevDevice>
  )
}
