import { Link } from "react-router-dom";
import "./ui/SignUpBanner.css";

function SignUpBanner() {
  return (
    <section className="signup-banner">
      <div>
        <h2>NEVER MISS A SHOW AGAIN</h2>
        <p>Follow artists, get notified the moment tickets drop.</p>
      </div>

      <Link to="/login" className="signup-banner-button">
        Create account
      </Link>
    </section>
  );
}

export default SignUpBanner;