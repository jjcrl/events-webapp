import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { authClient } from "../../services/authentication";
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
  
  // const { data: session } = authClient.useSession();

  useEffect(() =>{
    const fetchEvents = async () => {
      try {
        let city = "Manchester"; 

        if (session?.user) {
          //handle logged in / logged out logic (3 conditions)
        }
        
        const data = await getEvents({ city });
        setEvents(data.events);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [session])
  
  return (
    <>
      <h2>Events!</h2>
      <LogoutButton/>
      <EventFeed events={events} />
    </>
  );
}
