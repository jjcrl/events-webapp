import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../services/authentication";
import { getEvents } from "../../services/events";
import { getMyProfile } from "../../services/userProfile";
import EventFeed from "../../components/EventFeed";
import LogoutButton from "../../components/LogoutButton";
import Recommendations from "../../components/Recommendations";

export function FeedPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favouriteArtists, setFavouriteArtists] = useState([])
  const [cityFilter, setCityFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { data: session, isPending } = authClient.useSession();

  const navigate = useNavigate();
  useEffect(() => {
    getEvents({ city: "Manchester" })
      .then(data => setEvents(data.events))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!isPending && session) {
      getMyProfile()
        .then(({ profile }) => setFavouriteArtists(profile.favouriteArtists || []))
        .catch(setError)
        .finally(() => setLoading(false))
    }
  }, [isPending, session])

  if (loading) return <p>Loading events...</p>
  if (error) return <p>Something went wrong</p>


  return (
    <>
      <h2>Events!</h2>
      <LogoutButton />
      <Recommendations favouriteArtists={favouriteArtists} events={events} />
      <EventFeed
        events={events}
        favouriteArtists={favouriteArtists}
      />
    </>
  );
}
