const UserProfile = require("../models/userProfile")
const Event = require("../models/event")

const getMyProfile = async (req, res) => {
    try {
        // find the userprofile by the auth id
        const profile = await UserProfile.findOne({ authUserId: req.user.id })

        //if no profile found
        if (!profile) {
            return res.status(404).json({ error: "User's profile not found" })
        }
        return res.json({ profile })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

const toggleFavouriteArtists = async (req, res) => {
    try {
        // take artists of req body
        const { artist } = req.body

        // if no artists provided
        if (!artist) {
            return res.status(400).json({ error: "Artist is required" })
        }
        
        //1. find the current profile
        const profile = await UserProfile.findOne({ authUserId: req.user.id })

        const isFollowing = profile.favouriteArtists.includes(artist)

        const updatedProfile = await UserProfile.findOneAndUpdate(
            { authUserId: req.user.id },
            // If already following, remove artist ($pull). If not following, add artist ($addToSet) 
            // $pull & $addToSet are MongoDB operators
            isFollowing ? { $pull: {favouriteArtists: artist}} : { $addToSet: {favouriteArtists: artist}},
            { new: true }
        )        
        return res.json({ profile: updatedProfile })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

const toggleSavedEvent = async (req, res) => {
    try {
        const { eventId } = req.body
 
        if (!eventId) {
            return res.status(400).json({ error: "Event ID is required" })
        }
 
        const profile = await UserProfile.findOne({ authUserId: req.user.id })
 
        if (!profile) {
            return res.status(404).json({ error: "User's profile not found" })
        }
 
        const isSaved = profile.savedEvents.includes(eventId)
 
        const updatedProfile = await UserProfile.findOneAndUpdate(
            { authUserId: req.user.id },
            isSaved
                ? { $pull: { savedEvents: eventId } }
                : { $addToSet: { savedEvents: eventId } },
            { new: true }
        )
 
        return res.json({ profile: updatedProfile })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

const updateLocation = async (req, res) => {
    try {
        const { homeLocation } = req.body
        if (!homeLocation) {
            return res.status(400).json({ error: "User must provide a new location" })
        }
        const profile = await UserProfile.findOneAndUpdate(
            { authUserId: req.user.id },
            { homeLocation },
            { new: true }
        )
        return res.json({ profile })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}
/**
 * POST /profile/me/bookings
 * Adds an event ID to the user's bookings list (idempotent — won't add duplicates).
 * Body: { eventId: string }
 */
const addBooking = async (req, res) => {
    try {
        const { eventId } = req.body
 
        if (!eventId) {
            return res.status(400).json({ error: "Event ID is required" })
        }
 
        const profile = await UserProfile.findOne({ authUserId: req.user.id })
 
        if (!profile) {
            return res.status(404).json({ error: "User's profile not found" })
        }
 
        // Prevent double-booking the same event
        if (profile.bookings.includes(eventId)) {
            return res.status(409).json({ error: "Event already booked" })
        }
 
        const updatedProfile = await UserProfile.findOneAndUpdate(
            { authUserId: req.user.id },
            { $addToSet: { bookings: eventId } },
            { new: true }
        )
 
        return res.status(201).json({ profile: updatedProfile })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}
 
/**
 * GET /profile/me/bookings
 * Returns booking details (artist, venue, date, time) by looking up each event.
 */
const getMyBookings = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ authUserId: req.user.id })
 
        if (!profile) {
            return res.status(404).json({ error: "User's profile not found" })
        }
 
        if (!profile.bookings.length) {
            return res.json({ bookings: [] })
        }
 
        const events = await Event.find({ _id: { $in: profile.bookings } })
            .select("name artist venue date time ticketUrl")
 
        // Preserve booking order and tag upcoming vs past
        const now = new Date()
        const bookings = profile.bookings.map((id) => {
            const event = events.find((e) => e._id.toString() === id)
            if (!event) return null
            return {
                _id: event._id,
                name: event.name,
                artist: event.artist,
                venue: event.venue?.name || "TBC",
                date: event.date,
                time: event.time,
                isPast: new Date(event.date) < now,
            }
        }).filter(Boolean)
 
        return res.json({ bookings })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}
 
module.exports = { updateLocation, getMyProfile, toggleFavouriteArtists, toggleSavedEvent, addBooking, getMyBookings }