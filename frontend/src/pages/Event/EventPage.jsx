import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEventById } from "../../services/events";
import { authClient } from "../../services/authentication";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

export function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    getEventById(id)
      .then((data) => { setEvent(data.event) })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading event</p>;


  return (
    <>
    <NavBar/>
      <h1>{event.name}</h1>
      <p>{event.artist}</p>
      <p>{event.genre}</p>
      <p>{event.city}</p>
      {event.description && <p className="event-description">{event.description}</p>}
      <Link to={event.ticketUrl}>buy tickets</Link>
      <Footer />
    </>
  );
}