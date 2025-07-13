import { navigateTo } from '../../Router'

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => navigateTo('/')}>Go to home</button>
    </div>
  )
}
