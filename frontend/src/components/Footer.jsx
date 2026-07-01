import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-logo">En<span>Core</span></span>
        <p>© 2026 EnCore. Built at Makers Academy</p>
      </div>
      <div className="footer-team">
        <p className="footer-team-title">Our Team</p>
        <ul>
          <li>Joe Carroll</li>
          <li>Kit Trowbridge</li>
          <li>Zein Rafie</li>
          <li>Coral Han</li>
          <li>Maria Karagianni</li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;