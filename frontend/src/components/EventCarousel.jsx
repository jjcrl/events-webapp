import EventCard from "./EventCard/EventCard";
import "./EventCarousel.css";
import { useRef, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function EventCarousel({
  title = "Trending Now",
  events = [],
  favouriteArtists = [],
  setFavouriteArtists = () => {},
  savedEvents = [],
  onSavedToggled = () => {},
}) {
    const [selectedTag, setSelectedTag] = useState("");
    const scrollRef = useRef(null);
    const topTags = useMemo(() => {
        const counts = {};
        events.forEach((event) => {
        event.tags?.forEach((tag) => {
            if (!tag || tag === "Undefined" || tag === "Other") return;
            counts[tag] = (counts[tag] || 0) + 1;
        });
        });
        return Object.entries(counts)

        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag]) => tag);
  }, [events]);

    const filteredEvents = useMemo(() => {
        if (!selectedTag) return events;
        return events.filter((event) => event.tags?.includes(selectedTag));

    }, [events, selectedTag]);

useEffect(() => {
  const el = scrollRef.current;
  if (!el || filteredEvents.length === 0) return;

  const intervalId = setInterval(() => {
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    if (el.scrollLeft >= maxScroll - 1) {
      el.scrollLeft = 0;
    } else {
      el.scrollLeft += 1;
    }
  }, 20);              

  return () => clearInterval(intervalId);
}, [filteredEvents]);

    if (!events.length) return null;
    return (
    <section className="event-carousel-section">
        <div className="event-carousel-header">
        <h2>{title}</h2>
        <Link to="/feed" className="view-all-link">View all →</Link>
        </div>

        <div className="event-carousel-tags">
        <button
            className={!selectedTag ? "active" : ""}
            onClick={() => setSelectedTag("")}
        >
            All genres
        </button>
        {topTags.map((tag) => (
            <button
            key={tag}
            className={selectedTag === tag ? "active" : ""}
            onClick={() => setSelectedTag(tag)}
            >
            {tag}
            </button>
        ))}
        </div>
        <div className="event-carousel-wrapper" ref={scrollRef}>
    <div className="event-carousel">
        {filteredEvents.map((event) => (
        <div className="event-carousel-card" key={event._id}>
            <EventCard
            event={event}
            favouriteArtists={favouriteArtists}
            setFavouriteArtists={setFavouriteArtists}
            savedEvents={savedEvents}
            onSavedToggled={onSavedToggled}
            />
        </div>
        ))}
    </div>
    </div>
    </section>
    );

}

