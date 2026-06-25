const mongoose = require("mongoose");


// a new db for caching the major cities and checking the last time they were updated 
const cityCacheSchema = new mongoose.Schema({
  city: { type: String, unique: true, required: true },
  lastRefreshed: { type: Date, required: true },
}, { timestamps: true })

const CityCache = mongoose.model("CityCache", cityCacheSchema)

module.exports = CityCache