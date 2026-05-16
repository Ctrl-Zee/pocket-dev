import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { exampleKeys } from './exampleKeys'
import { getExamples, createExample } from './exampleRequests'
import type { ExampleFormValues } from '../schema/exampleSchema'

export function useExamplesQuery() {
  return useQuery({
    queryKey: exampleKeys.list(),
    queryFn: getExamples,
  })
}

export function useCreateExampleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ExampleFormValues) => createExample(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exampleKeys.list() })
      toast.success('Example created')
    },
  })
}
