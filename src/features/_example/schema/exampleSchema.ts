import { z } from 'zod/v4'

export const exampleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  status: z.enum(['active', 'completed']),
})

export type ExampleFormValues = z.infer<typeof exampleSchema>
