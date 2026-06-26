import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../services/authentication";
import { getEvents } from "../../services/events";
import { getMyProfile } from "../../services/userProfile";
import EventFeed from "../../components/EventFeed";
import LogoutButton from "../../components/LogoutButton";

export function FeedPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favouriteArtists, setFavouriteArtists] = useState([])
  const {data:session} = authClient.useSession();
  const [cityFilter, setCityFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getEvents({ city: "Manchester" })
      .then((data) => setEvents(data.events))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
    
    if (session?.user) {
      getMyProfile()
        .then(({ profile }) => setFavouriteArtists(profile.favouriteArtists))
        .catch((err) => setError(err))
    } 
  }, [session])
  
  if (loading) return <p>Loading events...</p>
  if (error) return <p>Something went wrong</p>

  return (
    <>
      <h2>Events!</h2>
      <LogoutButton />
      <EventFeed 
        events={events}
        favouriteArtists={favouriteArtists}
      />
    </>
  );
}
