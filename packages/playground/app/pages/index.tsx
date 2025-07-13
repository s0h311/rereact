import { navigateTo } from '../../Router'

export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>

      <button onClick={() => navigateTo('/login')}>Go to login</button>
      <button onClick={() => navigateTo('/dashboard')}>Go to dashboard</button>
    </div>
  )
}
