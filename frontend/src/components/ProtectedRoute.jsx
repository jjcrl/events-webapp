import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authClient } from "../services/authentication"

const ProtectedRoute = ({ children, fallback = null }) => {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  if (isPending) return fallback; 
  if (!session) return <Navigate to="/login" replace />;
  return children
}

export default ProtectedRoute