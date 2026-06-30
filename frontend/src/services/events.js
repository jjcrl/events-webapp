const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const getEvents = async (filters = {}) => {
    try {
        //remove any empty filters before sending
        const hasValue = (value) => {
            return value !== undefined &&
                value !== null &&
                value !== '';
        }
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => hasValue(v))
        )
        const params = new URLSearchParams(cleanFilters)

        const response = await fetch(`${BACKEND_URL}/events?${params}`, {
            credentials: "include"
        })
        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            throw new Error(data.error || `Failed to fetch events (${response.status})`)
        }
        return response.json()
    } catch (err) {
        console.error("getEvents error:", err)
        throw err
    }
}

export const getEventById = async (id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/events/${id}`, {
            credentials: "include"
        })

        if (!response.ok) {
            throw new Error("Failed to fetch event")
        }

        return response.json()

    } catch (err) {
        console.error("getSingleEvent error:", err)
        throw err
    }
}

export const getCities = async () => {
    const response = await fetch(`${BACKEND_URL}/events/cities`,{
        credentials: "include",
});
    if (!response.ok) {
        throw new Error("Failed to fetch cities");
    }

    return response.json();
};

/**
 * Fetches the ticketUrl for a given event from the backend.
 * Used by EventPage when the user clicks "Buy Tickets".
 */
export const getPurchaseLink = async (eventId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/events/${eventId}`, {
            credentials: "include"
        })
 
        if (!response.ok) {
            throw new Error("Failed to fetch purchase link")
        }
 
        const data = await response.json()
        return { ticketUrl: data.event?.ticketUrl }
    } catch (err) {
        console.error("getPurchaseLink error:", err)
        throw err
    }
}