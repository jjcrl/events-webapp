import { useEffect, useState } from "react";
import { getMyProfile } from "../../services/userProfile";
import { authClient } from "../../services/authentication";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { data: session, isPending } = authClient.useSession()

    const navigate = useNavigate();

    useEffect(() => {
        getMyProfile()
            .then((data) => setProfile(data.profile))
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    }, []);

    return (
        <div>
            <h1> Profile</h1>
            {profile &&
                <div>
                    <p>Your location: {profile.homeLocation.city}</p>
                    <p>Your favourite artists: {profile.favouriteArtists}</p>
                    <p>Your bookings: {profile.bookings}</p>
                    <p>Your name: {session.user.name}</p>
                </div>
            }
        </div>
    )
}