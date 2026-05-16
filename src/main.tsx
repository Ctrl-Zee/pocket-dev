import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { queryClient } from './lib/queryClient'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

function App() {
  return (
    <StrictMode>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster richColors closeButton />
        </QueryClientProvider>
      </ClerkProvider>
    </StrictMode>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')
createRoot(rootElement).render(<App />)
