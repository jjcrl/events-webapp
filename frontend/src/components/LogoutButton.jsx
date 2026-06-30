// import { useNavigate } from "react-router-dom";
// import { authClient } from "../services/authentication"

// function LogoutButton() {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await authClient.signOut()
//     navigate("/login")
//   }

//   return <button onClick={handleLogout}>Log out</button>;
// }

// export default LogoutButton;

import { useNavigate } from "react-router-dom";
import { authClient } from "../services/authentication"

function LogoutButton({ className }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut()
    navigate("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className={className ?? "rounded-md border border-primary-foreground/20 px-5 py-2 text-primary-foreground font-medium hover:bg-primary-foreground/10 hover:border-primary-foreground/40 transition-colors"}
    >
      Log out
    </button>
  );
}

export default LogoutButton;