import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../services/authentication";
import { getEvents } from "../../services/events";
import EventFeed from "../../components/EventFeed";
import LogoutButton from "../../components/LogoutButton";

export function FeedPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cityFilter, setCityFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(data.events))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <h2>Events!</h2>
      <LogoutButton />
      <EventFeed events={events} />
    </>
  );
}
