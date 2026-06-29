import React from 'react'
import EventCard from './EventCard/EventCard'

function Recommendations({ favouriteArtists, setFavouriteArtists, savedEvents, bookings = [], onSavedToggled, events }) {

    // genres from favourite artists
    const genresFromArtists = [...new Set(
        events
            .filter(event => favouriteArtists.includes(event.artist))
            .map(event => event.tags?.[0])
            .filter(Boolean)
    )]

    // genres from saved events
    // savedEvents is now an array of objects (new schema)
    // Guard against the old plain string IDs so nothing breaks if old data still exists.
    const savedEventObjects = Array.isArray(savedEvents)
        ? savedEvents.filter(e => typeof e === 'object' && e !== null)
        : []

    // Collect tags from saved event snapshots
    const genresFromSaved = [...new Set(
        savedEventObjects.flatMap(e => e.tags || []).filter(Boolean)
    )]

    // Also look up saved events in the feed (catches events saved before the
    // schema migration that may still be represented as IDs)
    const savedIds = new Set([
        ...savedEventObjects.map(e => e.eventId),
        ...savedEvents.filter(e => typeof e === 'string'),
    ])
    const bookingIds = new Set(bookings)

    const genresFromSavedFeed = [...new Set(
        events
            .filter(event => savedIds.has(event._id))
            .map(event => event.tags?.[0])
            .filter(Boolean)
    )]

    // genres from past purchases (bookings)
    const genresFromBookings = [...new Set(
        events
            .filter(event => bookingIds.has(event._id))
            .map(event => event.tags?.[0])
            .filter(Boolean)
    )]

    // Merge all genre signals
    const allFavouriteGenres = [...new Set([
        ...genresFromArtists,
        ...genresFromSaved,
        ...genresFromSavedFeed,
        ...genresFromBookings,
    ])]

    // Filter events by merged genres, excluding already-saved ones
    const recommendedEvents = allFavouriteGenres.length > 0
        ? events.filter(event =>
            allFavouriteGenres.includes(event.tags?.[0]) &&
            !savedIds.has(event._id) && // don't re-recommend what's already saved
            !bookingIds.has(event._id) // Exclude already-purchased events
          )
        : []

    const hasActivity = favouriteArtists.length > 0 || savedEventObjects.length > 0

    return (
        <div className='recoms'>
            <h2>Recommended for you</h2>
            {!hasActivity ? (
                <p>Save events or follow artists to see personalised recommendations</p>
            ) : recommendedEvents.length === 0 ? (
                <p>No new recommendations right now — check back after more events are added!</p>
            ) : (
                <div className="recommended-events">
                    {recommendedEvents.slice(0, 5).map(event => (
                        <EventCard
                            key={event._id}
                            event={event}
                            favouriteArtists={favouriteArtists}
                            setFavouriteArtists={setFavouriteArtists}
                            savedEvents={savedEvents}
                            onSavedToggled={onSavedToggled}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Recommendations