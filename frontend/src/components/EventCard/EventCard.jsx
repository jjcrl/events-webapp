import { useNavigate } from "react-router-dom";
import { toggleSavedEvent } from "../../services/userProfile";

import { Bookmark, BookMarked } from "lucide-react";

import { Button } from "../ui/button";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}


export default function EventCard({ event, favouriteArtists, savedEvents, isLoggedIn }) {
    const navigate = useNavigate();
    if (!event) return null;

    const isSaved = savedEvents.includes(event._id);

    function handleCardClick() {
        navigate(`/events/${event._id}`);
    }

    async function handleSaveToFavourites(e) {
        e.stopPropagation(); // Handles the click on the button without triggering other click handlers
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        await toggleSavedEvent(event._id);
    }

    function pickEventCardImage(images) {
        const targetRatio = 16 / 9;
        const minWidth = 640; // covers most card sizes at 2x density

        const sixteenNine = images
            .filter(img => Math.abs(img.width / img.height - targetRatio) < 0.05)
            .sort((a, b) => a.width - b.width);

        return (
            sixteenNine.find(img => img.width >= minWidth)
            ?? sixteenNine.at(-1)
            ?? images.sort((a, b) => b.width - a.width)[0]
        );
    }

    let sizes = pickEventCardImage(event.images)

  return (
    <div
        className="event-card"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
        data-testid="event-card"
    >
        <div className="relative">
            {event.images && (
                <img
                    src={sizes.url}
                    alt={`${event.name} image`}
                    className="w-full rounded aspect-square object-cover object-center"
                />
            )}
            <Button
                variant="default"
                size="icon"
                onClick={handleSaveToFavourites}
                className="absolute bottom-2 right-2"
            >
                <Bookmark />
            </Button>
        </div>
        <div className="event_body">
            <p className="font-bold text-l text--primary">{event.name}</p>
            <p className="text-sm text-secondary">{formatDate(event.date)} </p>
            <p className="text-sm text-primary">{event.venue?.name ? `${event.venue.name}` : ""}</p>
        </div>
    </div>
);
}