import { axiosClient } from '@/lib/axiosClient'
import type { ExampleItem } from '../types/ExampleTypes'
import type { ExampleFormValues } from '../schema/exampleSchema'

export async function getExamples(): Promise<ExampleItem[]> {
  const { data } = await axiosClient.get<ExampleItem[]>('/examples')
  return data
}

export async function createExample(payload: ExampleFormValues): Promise<ExampleItem> {
  const { data } = await axiosClient.post<ExampleItem>('/examples', payload)
  return data
}
