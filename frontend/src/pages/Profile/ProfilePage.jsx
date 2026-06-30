import { useEffect, useState } from "react";
import { getMyProfile, getMyBookings } from "../../services/userProfile";
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

export function ProfilePage() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookings, setBookings] = useState([]);

    const { data: session, isPending } = authClient.useSession()

    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([getMyProfile(), getMyBookings()])
            .then(([profileData, bookingsData]) => {
                setProfile(profileData.profile);
                setBookings(bookingsData.bookings || []);
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }, []);

    if (error) return <p>{error.message}</p>;

    const upcomingBookings = bookings.filter((b) => !b.isPast);
    const pastBookings = bookings.filter((b) => b.isPast);

    return (
        <>
            <NavBar />
            {profile && (
                <div className="page">
                    <div className="profile-details">
                        <div className="fallback" />
                        <p>{session.user.name}</p>
                        <p>{session.user.email}</p>
                        <p>Home Location: {profile.homeLocation.city}</p>
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

                    </div>
                    <div className="profile-actions">
                        <section aria-label="Upcoming bookings">
                            <h2>Upcoming Bookings</h2>
                            {loading ? (
                                <p>Loading bookings...</p>
                            ) : upcomingBookings.length === 0 ? (
                                <p><i>No upcoming bookings.</i></p>
                            ) : (
                                <ul>
                                    {upcomingBookings.map((booking) => (
                                        <li key={booking._id}>
                                            <strong>{booking.artist}</strong>
                                            <br />
                                            {booking.name}
                                            <br />
                                            {booking.venue?.name || booking.venue} &mdash; {formatDate(booking.date)}{booking.time ? ` at ${booking.time}` : ""}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                        <section aria-label="Past bookings">
                            <h2>Past Bookings</h2>
                            {loading ? (
                                <p>Loading bookings...</p>
                            ) : pastBookings.length === 0 ? (
                                <p><i>No past bookings.</i></p>
                            ) : (
                                <ul>
                                    {pastBookings.map((booking) => (
                                        <li key={booking._id}>
                                            <strong>{booking.artist}</strong>
                                            <br />
                                            {booking.name}
                                            <br />
                                            {booking.venue?.name || booking.venue} &mdash; {formatDate(booking.date)}{booking.time ? ` at ${booking.time}` : ""}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}
