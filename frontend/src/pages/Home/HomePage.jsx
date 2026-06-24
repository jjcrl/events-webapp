import { Link } from "react-router-dom";

import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home">
      <h1>Welcome to Acebook!</h1>
      <Link to="/login">Log In/sign up</Link>
    </div>
  );
}
