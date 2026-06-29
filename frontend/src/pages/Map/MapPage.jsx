import Map from '../../components/Map'
import { useState, useEffect, useMemo } from "react";
import { getEvents } from '../../services/events';


export function MapPage(props) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        getEvents({ city: "Manchester" })
            .then((d) => setEvents(d.events))
            .catch((e) => console.log(e))
            .finally(() => setLoading(false))
    },)


    return (
        <>
            <div className='map-page'>
                <Map events={events} height={"100%"} width={"100%"} zoom={12} />
            </div>
        </>
    )
}

