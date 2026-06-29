import { useEffect, useState } from "react";
import { getMyProfile, getMyBookings, getSavedEvents } from "../../services/userProfile";
import { authClient } from "../../services/authentication";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

function formatDate(dateStr) {
    if (!dateStr) return "TBC";
    return new Date(dateStr).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatTime(timeStr) {
    if (!timeStr) return "";
    if (timeStr.split(":").length === 3) {
        return timeStr;
    }
    return `${timeStr}:00`;
}

// Compact card used for both saved events and bookings on the profile page
function EventSnapshotCard({ item, onClick }) {
    return (
        <li
            className="event-snapshot-card"
            data-testid="event-snapshot-card"
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
            style={{ cursor: onClick ? "pointer" : "default" }}
        >
            {item.image?.url && (
                <img
                    src={item.image.url}
                    alt={`${item.name} event image`}
                    className="event-snapshot-image"
                    data-testid="event-snapshot-image"
                />
            )}
            <div className="event-snapshot-body">
                <strong className="event-snapshot-artist">{item.artist}</strong>
                <p className="event-snapshot-name">{item.name}</p>
                <p className="event-snapshot-venue">{item.venue?.name || item.venue}</p>
                <p className="event-snapshot-date">
                    {formatDate(item.date)}
                    {item.time ? ` · ${formatTime(item.time)}` : ""}
                </p>
                {item.city && <p className="event-snapshot-city">{item.city}</p>}
                {item.isPast && (
                    <span className="event-snapshot-past-badge" data-testid="past-badge">
                        Past
                    </span>
                )}
            </div>
        </li>
    );
}

export function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [savedEvents, setSavedEvents] = useState([]);

    const { data: session } = authClient.useSession();
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([getMyProfile(), getMyBookings(), getSavedEvents()])
            .then(([profileData, bookingsData, savedData]) => {
                setProfile(profileData.profile);
                setBookings(bookingsData.bookings || []);
                setSavedEvents(savedData.savedEvents || []);
            })
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, []);

    if (error) return <p>{error.message}</p>;
    if (loading) return <p>Loading profile…</p>;

    const upcomingBookings = bookings.filter((b) => !b.isPast);
    const pastBookings = bookings.filter((b) => b.isPast);
    const upcomingSaved = savedEvents.filter((e) => !e.isPast);
    const pastSaved = savedEvents.filter((e) => e.isPast);

    return (
        <div>
            <NavBar />
            <h1>Profile</h1>

            {profile && (
                <div>
                    <p>Your location: {profile.homeLocation.city}</p>

                    <p>Your favourite artists:</p>
                    {profile.favouriteArtists.length < 1 ? (
                        <p><i>Follow some artists for personalised recommendations!</i></p>
                    ) : (
                        <ul>
                            {profile.favouriteArtists.map((artist) => (
                                <li key={artist}>{artist}</li>
                            ))}
                        </ul>
                    )}

                    <section aria-label="Upcoming saved events">
                        <h2>Saved Events</h2>
                        {upcomingSaved.length === 0 ? (
                            <p><i>No upcoming saved events.</i></p>
                        ) : (
                            <ul className="event-snapshot-list" data-testid="saved-events-list">
                                {upcomingSaved.map((event) => (
                                    <EventSnapshotCard
                                        key={event.eventId}
                                        item={event}
                                        onClick={() => navigate(`/events/${event.eventId}`)}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>

                    <section aria-label="Past saved events">
                        <h2>Past Saved Events</h2>
                        {pastSaved.length === 0 ? (
                            <p><i>No past saved events.</i></p>
                        ) : (
                            <ul className="event-snapshot-list" data-testid="past-saved-events-list">
                                {pastSaved.map((event) => (
                                    <EventSnapshotCard
                                        key={event.eventId}
                                        item={event}
                                        onClick={() => navigate(`/events/${event.eventId}`)}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>

                    <section aria-label="Upcoming bookings">
                        <h2>Upcoming Bookings</h2>
                        {upcomingBookings.length === 0 ? (
                            <p><i>No upcoming bookings.</i></p>
                        ) : (
                            <ul className="event-snapshot-list" data-testid="bookings-list">
                                {upcomingBookings.map((booking) => (
                                    <EventSnapshotCard
                                        key={booking._id}
                                        item={booking}
                                        onClick={booking.ticketUrl ? () => window.open(booking.ticketUrl, "_blank") : undefined}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>

                    <section aria-label="Past bookings">
                        <h2>Past Bookings</h2>
                        {pastBookings.length === 0 ? (
                            <p><i>No past bookings.</i></p>
                        ) : (
                            <ul className="event-snapshot-list" data-testid="past-bookings-list">
                                {pastBookings.map((booking) => (
                                    <EventSnapshotCard
                                        key={booking._id}
                                        item={booking}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>

                    <p>Your name: {session?.user?.name}</p>
                </div>
            )}
            <Footer />
        </div>
    );
}