import React from 'react'
import EventCard from './EventCard/EventCard'

function Recommendations({ favouriteArtists, setFavouriteArtists, savedEvents, onSavedToggled, events }) {

    // create a unique list of genres based on the fave artist 
    const favouriteGenres = [...new Set(
        events
            // filter events that based on the fave artist
            .filter(event => favouriteArtists.includes(event.artist))
            // get back the main genre from those events
            .map(event => event.tags[0])
            // filter out non truthy values -> "" / undefined etc
            .filter(Boolean)
    )]

    // get events that have the same genre
    const recommendedEvents = favouriteGenres.length > 0
        // filter events that have the same genre as fave genres
        ? events.filter(event => favouriteGenres.includes(event.tags[0]))
        // else return empty array if none found
        : []

    return (
        <div className='recoms'>
            {recommendedEvents.length === 0 ? (
                <p>Add favourite artists to see recommendations</p>
            ) : (
                recommendedEvents.slice(0, 5).map(event => (
                    <EventCard
                        key={event._id}
                        event={event}
                        favouriteArtists={favouriteArtists}
                        setFavouriteArtists={setFavouriteArtists}
                        savedEvents={savedEvents}
                        onSavedToggled={onSavedToggled}
                    />
                ))
            )}
        </div>
    )
}

export default Recommendations