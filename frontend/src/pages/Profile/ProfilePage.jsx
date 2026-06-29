import { useEffect, useState } from "react";
import { getMyProfile, updateHomeLocation } from "../../services/userProfile";
import { authClient } from "../../services/authentication";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import LocationSearch from "../../components/LocationSearch";

export function ProfilePage() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [homeLocation, setHomeLocation] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null)

    const { data: session, isPending } = authClient.useSession()

    const navigate = useNavigate();

    useEffect(() => {
        getMyProfile()
            .then((data) => {
                setProfile(data.profile)
                setHomeLocation(data.profile.homeLocation?.city)})
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    }, []);


    const handleLocationSubmit = async (e) => {
        e.preventDefault()
        if (!selectedLocation) return
        try {
            const updatedCity = await updateHomeLocation({ 
                city: selectedLocation.city, 
                lat: selectedLocation.lat, 
                long: selectedLocation.lng  // ← Geoapify uses lng, backend expects long
            })
            setHomeLocation(updatedCity)
            setSuccess(true)
        } catch (err) {
            setError(err)
        }
    }

    if (error) return <p>{error.message}</p>;

    return (
        <div>
            <NavBar />
            <h1> Profile</h1>
            {profile &&
                <div>
                    <form onSubmit={handleLocationSubmit}>
                        <p>Your location: {homeLocation}</p>
                        <LocationSearch onCitySelect={({ city, lat, lng }) => {
                            setSelectedLocation({ city, lat, lng })
                        }} />
                        <button type="submit">Update</button>
                    </form>
                    <p>Your favourite artists: </p>
                    {profile.favouriteArtists.length < 1 ? (
                        <p><i>Follow some artists for personalised recommendations!</i></p>
                    ) : (
                        <ul>
                            {profile.favouriteArtists.map((artist) => (
                                <li key={artist}>{artist}</li>
                            ))}
                        </ul>
                    )}
                    <p>Your bookings: </p>
                    {profile.bookings.length < 1 ? (
                        <p><i>No current bookings.</i></p>
                    ) : (
                        <ul>
                            {profile.bookings.map((booking) => (
                            <li key={booking}>{booking}</li>
                            ))}
                        </ul>
                    )}
                    <p>Your name: {session.user.name}</p>
                </div>
            }
        </div>
    )
}