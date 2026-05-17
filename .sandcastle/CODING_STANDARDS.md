# Architecture Reference

---

## Stack

> Always use the **latest stable version** of each library.

### Core

| Library                | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| React                  | UI framework                                 |
| TypeScript             | Type safety                                  |
| Vite                   | Build tool (SWC plugin for fast refresh)     |
| @tanstack/react-router | File-based routing with auto code-splitting  |
| @tanstack/react-query  | Server state management                      |
| zustand                | Client-side UI state                         |
| react-hook-form        | Form state management                        |
| axios                  | HTTP client                                  |
| zod                    | Schema validation (with @hookform/resolvers) |

### Auth

| Library            | Purpose                                  |
| ------------------ | ---------------------------------------- |
| @clerk/clerk-react | Authentication, user management, session |

### UI

| Library | Purpose             |
| ------- | ------------------- |
| sonner  | Toast notifications |
| clsx    | Conditional classes |

> Add a component library (MUI, shadcn, Chakra, etc.) based on project needs.
> No component library is installed by default.

### Date

| Library  | Purpose        |
| -------- | -------------- |
| date-fns | Date utilities |

### Testing

| Library                     | Purpose                                |
| --------------------------- | -------------------------------------- |
| vitest                      | Test runner (Vite-native, zero-config) |
| @testing-library/react      | Component rendering and interaction    |
| @testing-library/user-event | Realistic user interaction simulation  |
| msw                         | API mocking (Mock Service Worker)      |
| @vitest/coverage-v8         | Coverage reporting                     |

---

## Folder Structure

```
src/
├── routes/              # TanStack file-based routes
├── features/            # Domain modules — bulk of the codebase
│   └── {feature}/
│       ├── api/         # Query keys, queries, mutations, requests
│       ├── components/  # Feature-specific UI
│       ├── hooks/       # Feature-specific hooks
│       ├── schema/      # Zod validation schemas
│       └── types/       # TypeScript types
├── components/          # Shared UI components
├── hooks/               # Shared hooks
├── lib/                 # Infra setup (queryClient, auth config, toast)
├── mocks/               # MSW handlers and server setup
│   ├── handlers/        # One handler file per feature domain
│   └── server.ts        # MSW server instance
├── store/               # Zustand stores
├── utils/               # Formatters, helpers
└── assets/              # SVGs, images
```

### Rules

- Feature code stays in `features/`. Only truly shared UI goes in `components/`.
- API layer is always three files: `*Keys.ts`, `*Requests.ts`, `*Queries.ts`.
  Split into `*Queries.ts` + `*Mutations.ts` for large features.
- No barrel exports at `src/` root.
- Route files are minimal — imports and redirects only. Logic lives in `features/`.
- Test files are co-located: `ClientsPage.tsx` → `ClientsPage.test.tsx`
- MSW handlers live in `src/mocks/handlers/` — one file per feature domain.

---

## Project Configuration

### TypeScript

`strict: true` is required in `tsconfig.json`. No exceptions. This enforces
strict null checks, no implicit any, and the full suite of strict type checks.
All code must satisfy strict mode — never use type assertions to work around it.

### ESLint + Prettier

Both must be configured before any feature code is written. A lint failure is
a signal to fix the code, not ignore the check. Claude Code must run
`npm run lint` and resolve all errors before considering any task complete.

### Vitest Coverage

Coverage threshold enforced in `vite.config.ts`:

```ts
test: {
  coverage: {
    provider: 'v8',
    thresholds: { lines: 80 },
  },
}
```

`npm run test` must pass with coverage above the threshold before any task
is considered complete.

---

## Routing

TanStack Router with file-based route generation. The Vite plugin scans
`src/routes/` and generates `routeTree.gen.ts`. Auto code-splitting is enabled.
Route files handle redirects and auth guards only — no business logic.

---

## Authentication — Clerk

Clerk handles all auth. No custom auth logic, no token management.

Wrap the app root in `<ClerkProvider>`. Protect routes via `beforeLoad`:

```tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.auth.userId) throw redirect({ to: '/sign-in' })
  },
})
```

Attach tokens via the axios request interceptor in `lib/axiosClient.ts`:

```ts
axiosClient.interceptors.request.use(async (config) => {
  const token = await getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

Access user context via Clerk hooks only:

```ts
const { userId, isSignedIn } = useAuth()
const { user } = useUser()
```

---

## Data Fetching

```
Component → useQuery/useMutation hook → request function → axios → API
```

Four-layer separation within `features/{feature}/api/`:

**Query Keys** (`*Keys.ts`) — hierarchical key factories:

```ts
export const clientKeys = {
  all: ['clients'] as const,
  summary: () => [...clientKeys.all, 'summary'] as const,
  detail: (id: number) => [...clientKeys.all, 'detail', id] as const,
}
```

**Request Functions** (`*Requests.ts`) — pure async, no hooks, no side effects:

```ts
export async function getClientSummary(): Promise<ClientSummaryDto[]> {
  const { data } = await axiosClient.get<ClientSummaryDto[]>('/Client/Summary')
  return data
}
```

**Query Hooks** (`*Queries.ts`) — thin wrappers around `useQuery`:

```ts
export function useClientSummaryQuery() {
  return useQuery({
    queryKey: clientKeys.summary(),
    queryFn: () => getClientSummary(),
  })
}
```

**Mutation Hooks** — cache strategy depends on mutation type:

| Mutation                            | Strategy                                                 |
| ----------------------------------- | -------------------------------------------------------- |
| Create                              | Invalidate lists — order and counts change unpredictably |
| Update                              | Write response to detail cache, invalidate lists         |
| Delete                              | Invalidate — list must reflect removal                   |
| High-frequency UI (toggle, reorder) | Optimistic update                                        |

Create — invalidate the list, toast on success:

```ts
export function useCreateClientMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.summary() })
      toast.success('Client created')
    },
  })
}
```

Update — write the response directly into the detail cache, invalidate lists:

```ts
export function useUpdateClientMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => updateClient(payload),
    onSuccess: (updatedClient) => {
      queryClient.setQueryData(clientKeys.detail(updatedClient.id), updatedClient)
      queryClient.invalidateQueries({ queryKey: clientKeys.summary() })
      toast.success('Client updated')
    },
  })
}
```

Optimistic update — for high-frequency interactions where latency matters:

```ts
export function useToggleTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleTask,
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(task.id) })
      const previous = queryClient.getQueryData(taskKeys.detail(task.id))
      queryClient.setQueryData(taskKeys.detail(task.id), { ...task, completed: !task.completed })
      return { previous }
    },
    onError: (_, task, context) => {
      queryClient.setQueryData(taskKeys.detail(task.id), context.previous)
    },
    onSettled: (_, __, task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(task.id) })
    },
  })
}
```

---

## Forms — React Hook Form

All forms use react-hook-form with Zod. Schema is defined first, type inferred
from it, never the other way around:

```ts
// features/clients/schema/clientSchema.ts
export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})
export type ClientFormValues = z.infer<typeof clientSchema>
```

Standard form setup:

```tsx
const form = useForm<ClientFormValues>({
  resolver: zodResolver(clientSchema),
  mode: 'all',
  reValidateMode: 'onChange',
  defaultValues: { name: '', email: '' },
})
```

Submission always goes through a mutation:

```tsx
const mutation = useCreateClientMutation()
const onSubmit = form.handleSubmit((values) => mutation.mutate(values))
```

---

## Component Conventions

- **Files**: PascalCase (`ClientsPage.tsx`, `ProjectForm.tsx`)
- **Hooks**: `use` prefix, camelCase (`useClientSummary.ts`)
- **Schemas**: camelCase (`clientSchema.ts`)
- **Type files**: PascalCase with `Types` suffix (`ClientTypes.ts`)
- **Exports**: named exports only — no default exports
- **Props**: `interface` with `Props` suffix, declared above the component

```tsx
interface ClientFormProps {
  mode: 'add' | 'edit'
  onSubmit: (payload: ClientFormValues) => void
  initialData?: ClientFormValues
  isSubmitting?: boolean
  onCancel: () => void
}
```

---

## Testing

Co-locate test files with the file they test. Test behavior, not implementation.
Mock the network with MSW — never mock individual functions.

Priority order: mutation hooks → form validation → page components.

MSW server is configured in `src/mocks/server.ts`. See that file for setup.
Handlers follow the pattern in `src/mocks/handlers/` — one file per domain.

---

## useEffect Rules

`useEffect` is for synchronizing with external systems only — DOM APIs,
WebSockets, third-party non-React widgets. It is not for reacting to state
changes or transforming data.

> Reference: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

**Derive values during render, not in an Effect:**

```tsx
// ✅
const fullName = firstName + ' ' + lastName
const visibleTodos = getFilteredTodos(todos, filter)
```

**Reset state with a key, not an Effect:**

```tsx
// ✅
<Profile userId={userId} key={userId} />
```

**Put user event logic in the event handler, not an Effect:**

```tsx
// ✅
function handleBuyClick() {
  addToCart(product)
  showNotification(`Added ${product.name} to the cart`)
}
```

**Never fetch data in an Effect — use TanStack Query.**

**Legitimate uses:** focus management, third-party widget sync, analytics on
mount, WebSocket setup with cleanup, `useSyncExternalStore` for external stores.

---

## Patterns to Always Follow

1. Feature module structure: always create `api/`, `components/`, `types/`, `schema/`
2. Three-file API pattern: Keys → Requests → Queries
3. Zod schemas with inferred types: `type FormValues = z.infer<typeof schema>`
4. Toast on mutation success — axios interceptor handles generic error toasts
5. Match cache strategy to mutation type — see Mutation Hooks table
6. Gate queries with `enabled: !!param` when a param is required
7. Named exports only — no default exports
8. All form state through react-hook-form — never useState for form fields
9. All auth through Clerk hooks — never custom state
10. `isSubmitting` comes from `mutation.isPending`, not `form.formState`

## Never Do

- Call axios directly from a component
- Store auth state in Zustand or React context
- Use useState for form fields
- Write inline Zod schemas inside a component
- Use default exports for components
- Skip the test file when adding a new feature module
- Mock individual functions in tests — use MSW handlers instead
- Use useEffect to fetch data, derive state, or handle user events
