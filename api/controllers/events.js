const Event = require("../models/event");

// Returns events filtered by city and optionally a date range
// Query params: city name, from date, to date
// Events are returned in chronological order (earlier first)
const getEvents = async (req, res) => {
    try {
        const { city, from, to } = req.query;

        const filter = {};

        //city filter - case-insensitive
        //$regex: use Regular Expressions (regex) to search patterns in strings
        //new RegExp(...): build a reg.expression dynamically from a variable
        //^(caret): to start at the beginning of the string
        //${city}: the actual value of the city variable we're searching for (ex. "London")
        //$: to end at the end of the string (so we avoid matches like "New London")
        //"i": to make it case-insensitive
        if (city) {
            filter.city = { $regex: new RegExp(`^${city}$`, "i") };
        }
        //date range filter
        if (from || to ) {
            filter.date = {};
            // building a date range filter - using regex (i.e. '$gte'/&lte: greater/less than or equal to)
            if (from) filter.date.$gte = new Date(from);
            if (to) filter.date.$lte = new Date(to);
        }
        //chronological sorting ascending
        const events = await Event.find(filter).sort({ date: 1 });

        res.status(200).json({ events });
    } catch (err) {
        console.error("getEvents error:", err);
        res.status(500).json({ error: "Failed to fetch events" });
    }
};

// GET /events/:id
// Returns a signle event by its MongoDB _id
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json({ events: event });
    } catch (err) {
        console.error("getEventById error:", err);
        // Mongoose throws a CastError (meaning failed to convert/cast a value) if the id string is not a valid ObjectId
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid event ID" });
        }
        res.status(500).json({ error: "Failed to fetch event" });
    }
};

module.exports = { getEvents, getEventById }