require('dotenv').config()
const mongoose = require("mongoose")
const { fetchAndStoreEventsForCity } = require("../services/ticketmaster")
const { ensureEventsForCity } = require("../services/ticketmaster")


//error for no db url
if (!process.env.MONGODB_URL) {
  throw new Error("Missing MONGODB_URL")
}

// major cities to begin with
const TOP_CITIES = ["Manchester", "London", "Bristol", "Glasgow", "Liverpool"]

// function to seed the db
const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URL)
  console.log("Connected to MongoDB")

  try {
    for (const city of TOP_CITIES) {
      // check the city and its events , check stale , update if needed
      const result = await ensureEventsForCity(city)
      console.log(`${city}:`, result)
    }
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected")
  }
}

// run the seed function
seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})

