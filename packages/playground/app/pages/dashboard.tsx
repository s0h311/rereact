import { navigateTo } from '../../Router'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => navigateTo('/')}>Go to home</button>
    </div>
  )
}
