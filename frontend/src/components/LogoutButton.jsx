import { useNavigate } from "react-router-dom";
import { authClient } from "../services/authentication"

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut()
    navigate("/login")
  }

  return <button onClick={handleLogout}>Log out</button>;
}

export default LogoutButton;
