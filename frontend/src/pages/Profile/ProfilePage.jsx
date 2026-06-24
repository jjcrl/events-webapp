import { useEffect, useState } from "react";
import { getMyProfile } from "../../services/userProfile";

export function ProfilePage() {
    const [ profile, setProfile ] = useState(null)
    useEffect(() => {
        getMyProfile()
            .then((data) => {
                console.log("data received:", data);
                setProfile(data.profile);
            })
            .catch((error) => {
                console.error("fetch failed:", error);
            });
    }, []);

    return (
        <div>
            {/* need to get user's name */}
            <h1> Profile</h1> 
            { profile && 
                <div>
                    <p>Your location: {profile.homeLocation.city}</p>
                    <p>Your favourite artists: {profile.favouriteArtists}</p>
                    <p>Your bookings: {profile.bookings}</p>
                </div>
            }
        </div>
    )
}