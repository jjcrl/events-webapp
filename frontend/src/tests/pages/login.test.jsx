import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { LoginPage } from "../../pages/Login/LoginPage"
import { authClient } from "../../services/authentication"
// Mock authClient
vi.mock("../../services/authentication", () => ({
  authClient: {
    signIn: {
      email: vi.fn()
    },
    signUp: {
      email: vi.fn()
    }
  }
}))
// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})
describe("LoginPage", () => {
  beforeEach(() => {
    authClient.signIn.email.mockReset?.()
    authClient.signUp.email.mockReset?.()
  })
  test("renders login form by default", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText("Email")).toBeTruthy()
    expect(screen.getByPlaceholderText("Password")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Log in" })).toBeTruthy()
  })
  test("toggles to signup form", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByTestId("toggle-auth"))
    expect(screen.getByPlaceholderText("Name")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Sign up" })).toBeTruthy()
  })
  test("shows error message when login fails", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: null,
      error: { message: "Invalid credentials" }
    })
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" }
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" }
    })
    fireEvent.click(screen.getByRole("button", { name: "Log in" }))  // ← fixed

    const error = await screen.findByText("Invalid credentials")
    expect(error).toBeTruthy()
  })
  test("calls signIn with email and password", async () => {
    authClient.signIn.email.mockResolvedValue({ data: {}, error: null })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" }
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" }
    })
    fireEvent.click(screen.getByRole("button", { name: "Log in" }))

    expect(authClient.signIn.email).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "password123"
    })
  })
})