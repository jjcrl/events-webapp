import { Link } from "react-router-dom";
import "./HomePage.css";
import Hero from "../../components/Hero";
import EventsBanner from "../../components/EventsBanner";
import SignUpBanner from "../../components/SignUpBanner";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar"

export function HomePage() {
  return (
    <div>
      <NavBar/>
      <Hero right={"this is the right"} left={"this is the left"} />
      <EventsBanner />
      <SignUpBanner right={"sign up today"} left={"join the crowd"} />
      <Footer details={"theese are some details"} />
    </div>
  );
}
