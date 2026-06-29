import { GoogleMap, useJsApiLoader } from "@react-google-maps/api"

const containerStyle = {
    width: "100%",
    height: "400px"
}

const center = {
    lat: 53.4808,
    lng: -2.2426
}

function Map() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    })

    if (!isLoaded) return <p>Loading map...</p>

    return (
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        />
    )
}

export default Map