import React from 'react'
import { useState, useEffect } from 'react'
import { getEvents } from "../../services/events"
import { getMyProfile } from '../../services/userProfile'
import NavBar from "../../components/NavBar"
import Footer from '../../components/Footer'
import { useNavigate } from 'react-router-dom'

function CalanderPage() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState({})
    const today = new Date()
    const [year] = useState(today.getFullYear())
    const [month] = useState(today.getMonth())
    const weeks = 5
    const navigate = useNavigate()

    function buildRollingGrid(events, startDate, weeks = 5) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)

        const totalDays = weeks * 7

        // Group events by YYYY-MM-DD key
        const eventsByDate = {}
        for (const event of events) {
            const d = new Date(event.date)
            const key = d.toISOString().slice(0, 10) // "2026-06-30"
            if (!eventsByDate[key]) eventsByDate[key] = []
            eventsByDate[key].push(event)
        }

        const cells = Array.from({ length: totalDays }, (_, i) => {
            const date = new Date(start)
            date.setDate(start.getDate() + i)
            const key = date.toISOString().slice(0, 10)

            return {
                date,
                day: date.getDate(),
                month: date.toLocaleString('default', { month: 'short' }),
                isFirstOfMonth: date.getDate() === 1,
                events: eventsByDate[key] || []
            }
        })

        return { cells }
    }

    const { cells } = buildRollingGrid(events, today, weeks)

    useEffect(() => {
        const from = new Date()
        from.setHours(0, 0, 0, 0)
        const to = new Date(from)
        to.setDate(from.getDate() + weeks * 7 - 1)
        to.setHours(23, 59, 59, 999)

        getMyProfile()
            .then((profile) => {
                setProfile(profile)
                return getEvents({
                    city: profile.profile.homeLocation.city,
                    from: from,
                    to: to
                })
            })
            .then((data) => setEvents(data.events))
            .catch((e) => console.log(e))
            .finally(() => setLoading(false))
    }, [])

    return (
        <>
            <NavBar />
            <div className='calender-page'>
                <div className='calender-grid'>
                    {cells.map((cell, i) => (
                        <div key={i} className='calender-cell'>
                            <span className='day-number'>
                                {cell.isFirstOfMonth ? `${cell.month} ${cell.day}` : cell.day}
                            </span>
                            {cell.events.map(event => (
                                <div key={event._id} className='cell-event' onClick={() => navigate(`/events/${event._id}`)}>
                                    {event.name}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CalanderPage