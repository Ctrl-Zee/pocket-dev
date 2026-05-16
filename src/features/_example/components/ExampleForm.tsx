import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { exampleSchema, type ExampleFormValues } from '../schema/exampleSchema'
import { useCreateExampleMutation } from '../api/exampleQueries'

export function ExampleForm() {
  const mutation = useCreateExampleMutation()

  const form = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: { name: '', status: 'active' },
  })

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values))

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...form.register('name')} />
        {form.formState.errors.name && <span>{form.formState.errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="status">Status</label>
        <select id="status" {...form.register('status')}>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
