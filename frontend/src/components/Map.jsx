import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api"
import { useNavigate } from "react-router-dom"


function Map(props) {

    const navigate = useNavigate();
    const containerStyle = {
        width: props.width,
        height: props.height
    }

    const center = {
        lat: 53.4808,
        lng: -2.2426
    }
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    })

    if (!isLoaded) return <p>Loading map...</p>




    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={props.centre || center}
            zoom={props.zoom}
        >
            {props.events.filter((e) => e.venue?.location?.coordinates).map((e) => (
                <MarkerF
                    key={e._id}
                    position={{
                        lat: e.venue.location.coordinates[1],
                        lng: e.venue.location.coordinates[0]
                    }}
                    onClick={(() => (navigate(`/events/${e._id}`)))}
                />
            ))}
        </GoogleMap>
    )
}

export default Map