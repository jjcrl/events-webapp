const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    genre: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String },
    city: { type: String, required: true },
    venue: { type: String },
    imageUrl: { type: String },
    ticketUrl: { type: String },
    ticketmasterId: { type: String, unique: true, sparse: true },
}, { timestamps: true});

// Indexing on date so there is chronological feed
eventSchema.index({ date: 1 });

// Compound indexing so we filter by city and sort by date
eventSchema.index({ city: 1, date: 1 })

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;