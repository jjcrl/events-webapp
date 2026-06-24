import { useNavigate } from "react-router-dom";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function EventCard({ event }) {
    const navigate = useNavigate();

    if (!event) return null;

    function handleClick() {
        navigate(`/events/${event._id}`);
    }

    return (
        <div
            className ="event-card"
            onClick={handleClick}
            // Allow users to interact
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
            data-testid="event-card"
        >
            {event.imageUrl && (
                <img
                    src={event.imageUrl}
                    alt={`${event.name} image`}
                    className="event-image"
            />
            )}

            <div className="event_body">
                <h2 className="event_title">{event.name}</h2>
                <p className="event_artist">{event.artist}</p>
                <p className="event_genre">{event.genre}</p>
                <p className="event_datetime">
                    {formatDate(event.date)}
                    {event.time && `· ${event.time}`}
                </p>
                <p className="event_location">
                    {event.venue ? `${event.venue}, ` : ""}
                    {event.city}
                </p>

            {/* {event.ticketUrl && (
            <a
                href={event.ticketUrl}
                target="_blank"
                rel="noreferrer"
            >
                Buy Tickets
            </a> */}
        </div>
    </div>    
);
}
// export default EventCard;
