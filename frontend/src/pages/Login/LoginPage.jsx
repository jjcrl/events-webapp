import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authClient } from "../../services/authentication"

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [toggle, setToggle] = useState(false)
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const handleLogInSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const { data, error } = await authClient.signIn.email({
      email,
      password
    })

    if (error) {
      setError(error.message)
      return
    }

    navigate('/feed')
  }

  const handleSignUpSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name
    })

    if (error) {
      setError(error.message)
      return
    }

    navigate('/feed')
  }

  return (
    <div>

      {!toggle ? (
        <>
          <h1>Log in</h1>
          {error && <p>{error}</p>}
          <form onSubmit={handleLogInSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Log in</button>
          </form>
        </>
      ) : (
        <>
          <h1>Sign up</h1>
          {error && <p>{error}</p>}
          <form onSubmit={handleSignUpSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign up</button>
          </form>


        </>
      )}
      <button onClick={(() => { setToggle(!toggle) })}>{toggle ? "login" : "signup"}</button>
    </div>
  )
}
