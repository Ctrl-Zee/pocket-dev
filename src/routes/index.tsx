import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <h1>React Boilerplate</h1>
      <p>Replace this with your app.</p>
    </div>
  )
}
