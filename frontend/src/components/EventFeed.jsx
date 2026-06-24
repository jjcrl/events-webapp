import { PointerEventsCheckLevel } from "@testing-library/user-event";
import EventCard from "./EventCard/EventCard";

const EventFeed = ({ events }) => {
    if (events.length === 0) {
        return <p>No events found</p>
    }

    return (
        <div>
            {events.map(event => (
                <EventCard key={event._id} event={event} />
            ))}

    </div>
)};

export default EventFeed;