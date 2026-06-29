import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete'

const CitySearch = ({ onCitySelect }) => {
    const handleSelect = (place) => {
        if (!place) return  // ← add this guard
        
        const city = place.properties.city || place.properties.name
        const lat = place.properties.lat
        const lng = place.properties.lon

    onCitySelect({ city, lat, lng })
    }

    return (
    <GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_API_KEY}>
        <GeoapifyGeocoderAutocomplete
            placeholder="Search for a city..."
            type="city"
            limit={3}
            placeSelect={handleSelect}
        />
    </GeoapifyContext>
    )
}

export default CitySearch