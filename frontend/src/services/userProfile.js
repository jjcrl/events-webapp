const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getMyProfile() {
    try {
        const requestOptions = {
            method: "GET",
            credentials: "include"
        }
        const response = await fetch(`${BACKEND_URL}/profile/me`, requestOptions)
        if (response.status !== 200) {
            throw new Error("Unable to fetch user's profile");
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function toggleFavouriteArtists(artist) {
    try {
        const requestOptions = {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({artist})
        }
        const response = await fetch(`${BACKEND_URL}/profile/me/favourite-artists`, requestOptions)
        if (response.status !== 200) {
            throw new Error("Unable to toggle favourite artist");
        }
        const data = await response.json();
        const newFavouriteArtists = data.profile.favouriteArtists
        return newFavouriteArtists;
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function toggleSavedEvent(eventId) {
    try {
        const requestOptions = {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId })
        }
        const response = await fetch(`${BACKEND_URL}/profile/me/saved-events`, requestOptions)
        if (response.status !== 200) {
            throw new Error("Unable to toggle saved event");
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err)
        throw err
    }
}


export async function updateHomeLocation({ city, lat, long }) {
    try {
        const requestOptions = {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                homeLocation: { city, lat, long }
            })
        }
        const response = await fetch(`${BACKEND_URL}/profile/me/location`, requestOptions)
        const data = await response.json()
        if (response.status !== 200) {
            throw new Error("Unable to update your home location")
        }
        return data.profile.homeLocation.city
    } catch (err) {
        console.error(err)
        throw err
    }
}