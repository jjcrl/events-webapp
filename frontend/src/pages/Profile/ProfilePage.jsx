import { useEffect, useState } from "react";
import { getMyProfile, getMyBookings, getSavedEvents } from "../../services/userProfile";
import { authClient } from "../../services/authentication";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import HomeLocationForm from "@/components/HomeLocationForm";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";

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
    const [hours, minutes] = timeStr.split(":");
    return minutes !== undefined ? `${hours}:${minutes}` : hours;
}

// Compact card used for both saved events and bookings on the profile page
function EventSnapshotCard({ item, onClick }) {
    return (
        <li
            className="event-card group list-none overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            data-testid="event-snapshot-card"
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
            style={{
                cursor: onClick ? "pointer" : "default",
            }}
        >
            {item.image?.url && (
                <img
                    src={item.image.url}
                    alt={`${item.name} event image`}
                    className="event-image h-36 w-full object-cover"
                    data-testid="event-snapshot-image"
                />
            )}
            <div className="event_body flex flex-col gap-1 p-4">
                <h3 className="event_title font-heading text-base leading-tight text-primary normal-case">{item.name}</h3>
                <p className="event_artist text-sm font-semibold text-secondary">{item.artist}</p>
                <p className="event_datetime text-xs text-muted-foreground">
                    {formatDate(item.date)}
                    {item.time && ` · ${formatTime(item.time)}`}
                </p>
                <p className="event_location text-xs text-muted-foreground">
                    {(item.venue?.name || item.venue) ? `${item.venue?.name || item.venue}, ` : ""}
                    {item.city}
                </p>
            </div>
        </li>
    );
}

function EventSnapshotGrid({ items, testId, emptyMessage, getOnClick }) {
    if (items.length === 0) {
        return <p className="mt-3 text-sm italic text-muted-foreground">{emptyMessage}</p>;
    }
    return (
        <ul
            className="mt-4 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3"
            data-testid={testId}
        >
            {items.map((item) => (
                <EventSnapshotCard
                    key={item.eventId ?? item._id}
                    item={item}
                    onClick={getOnClick ? getOnClick(item) : undefined}
                />
            ))}
        </ul>
    );
}

export function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [homeLocation, setHomeLocation] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [editingLocation, setEditingLocation] = useState(false)
    const [bookings, setBookings] = useState([]);
    const [savedEvents, setSavedEvents] = useState([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const { data: session } = authClient.useSession();
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([getMyProfile(), getMyBookings(), getSavedEvents()])
            .then(([profileData, bookingsData, savedData]) => {
                setProfile(profileData.profile);
                setHomeLocation(profileData.profile.homeLocation?.city);
                setBookings(bookingsData.bookings || []);
                setSavedEvents(savedData.savedEvents || []);
            })
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, []);


    const handleLocationSubmit = async (e) => {
        e.preventDefault()
        if (!selectedLocation) return
        try {
            const updatedCity = await updateHomeLocation({
                city: selectedLocation.city,
                lat: selectedLocation.lat,
                long: selectedLocation.lng  // Geoapify uses lng, backend expects long
            })
            setHomeLocation(updatedCity)
            setSuccess(true)
            setEditingLocation(false)
            setSelectedLocation(null)
        } catch (err) {
            setError(err)
        }
    }

    if (error) return <p>{error.message}</p>;
    if (loading) return <p>Loading profile…</p>;

    const upcomingBookings = bookings.filter((b) => !b.isPast);
    const pastBookings = bookings.filter((b) => b.isPast);
    const upcomingSaved = savedEvents.filter((e) => !e.isPast);
    const pastSaved = savedEvents.filter((e) => e.isPast);

    const fullName = session?.user?.name?.trim();
    const firstName = fullName ? fullName.split(" ")[0] : "there";
    const avatarLetter = firstName.charAt(0).toUpperCase() || "?";

    return (
        <div className="min-h-screen bg-background">
            <NavBar />

            <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
                <h1 className="sr-only">Profile</h1>

            {profile && (
                <div>
                    <p><strong>Your location:</strong> {homeLocation}</p>
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger>
                            <Button>Edit</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <HomeLocationForm 
                                onLocationUpdated={(updatedCity) => {
                                    setHomeLocation(updatedCity)
                                    setIsPopoverOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                    <p><strong>Your favourite artists:</strong> </p>
                    {profile.favouriteArtists.length < 1 ? (
                        <p><i>Follow some artists for personalised recommendations!</i></p>
                {/* Header card — first name + home location, with location editing at the top */}
                <div className="flex flex-col gap-4 rounded-2xl bg-primary px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-7">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-xl text-secondary-foreground normal-case">
                            {avatarLetter}
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-primary-foreground">{firstName}</p>
                            <p className="text-sm text-primary-foreground/70">
                                {homeLocation || "No location set"}
                            </p>
                        </div>
                    </div>

                    {!editingLocation ? (
                        <button
                            type="button"
                            onClick={() => setEditingLocation(true)}
                            className="shrink-0 self-start rounded-md border border-primary-foreground/20 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/10 md:self-auto"
                        >
                            Update location
                        </button>
                    ) : (
                        <form
                            onSubmit={handleLocationSubmit}
                            className="flex flex-wrap items-center gap-2 md:flex-nowrap"
                        >
                            <div className="w-full min-w-[14rem] sm:w-56">
                                <LocationSearch onCitySelect={({ city, lat, lng }) => {
                                    setSelectedLocation({ city, lat, lng })
                                }} />
                            </div>
                            <button
                                type="submit"
                                className="shrink-0 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingLocation(false)
                                    setSelectedLocation(null)
                                }}
                                className="shrink-0 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </div>

                {success && (
                    <p className="mt-3 text-sm font-medium text-secondary">Your home location has been updated.</p>
                )}

                {profile && (
                    <div>
                        {/* Favourite artists */}
                        <section className="mt-8">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Favourite artists
                            </h2>
                            {profile.favouriteArtists.length < 1 ? (
                                <p className="mt-3 text-sm italic text-muted-foreground">
                                    Follow some artists for personalised recommendations!
                                </p>
                            ) : (
                                <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                                    {profile.favouriteArtists.map((artist) => (
                                        <li
                                            key={artist}
                                            className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground"
                                        >
                                            {artist}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section aria-label="Upcoming saved events" className="mt-10">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Saved Events
                            </h2>
                            <EventSnapshotGrid
                                items={upcomingSaved}
                                testId="saved-events-list"
                                emptyMessage="No upcoming saved events."
                                getOnClick={(event) => () => navigate(`/events/${event.eventId}`)}
                            />
                        </section>

                        <section aria-label="Past saved events" className="mt-10">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Past Saved Events
                            </h2>
                            <EventSnapshotGrid
                                items={pastSaved}
                                testId="past-saved-events-list"
                                emptyMessage="No past saved events."
                                getOnClick={(event) => () => navigate(`/events/${event.eventId}`)}
                            />
                        </section>

                        <section aria-label="Upcoming bookings" className="mt-10">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Upcoming Bookings
                            </h2>
                            <EventSnapshotGrid
                                items={upcomingBookings}
                                testId="bookings-list"
                                emptyMessage="No upcoming bookings."
                                getOnClick={(booking) => booking.ticketUrl ? () => window.open(booking.ticketUrl, "_blank") : undefined}
                            />
                        </section>

                        <section aria-label="Past bookings" className="mt-10">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Past Bookings
                            </h2>
                            <EventSnapshotGrid
                                items={pastBookings}
                                testId="past-bookings-list"
                                emptyMessage="No past bookings."
                            />
                        </section>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}