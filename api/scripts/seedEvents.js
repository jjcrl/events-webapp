require('dotenv').config()
const mongoose = require("mongoose")
const Event = require("../models/event")
// the function to run once to seed the mongo db
const seedEvents = async () => {
  // make connection to DB
  await mongoose.connect(process.env.MONGODB_URL)
  console.log("Connected to MongoDB")
  //url param options
  const params = new URLSearchParams({
    apikey: process.env.TICKETMASTER_API_KEY,
    city: 'Manchester',
    sort: 'date,asc',
    size: '10',
    classificationName: "Music"
  });
  // endpoint to fetch from 
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params}`;
  // async await response and pull data from it 
  const response = await fetch(url)
  const data = await response.json()
  // err handle on no events
  if (!data._embedded?.events) {
    console.log("No events returned from Ticketmaster")
    await mongoose.disconnect()
    return
  }
  // destructure events off data
  const { events } = data._embedded
  console.log(`Got ${events.length} events from Ticketmaster`)
  // build out new object matchig fields in schema
  const newObject = events.map((e) => {
    const name = e.name
    const artist = e._embedded?.attractions?.[0]?.name || e.name
    const genre = e.classifications?.[0]?.genre?.name || "Unknown"
    const date = e.dates.start.localDate
    const time = e.dates?.start?.localTime
    const city = e._embedded.venues[0].city.name
    const venue = e._embedded.venues[0].name
    const imageUrl = e.images[0].url
    const ticketUrl = e.url
    const ticketmasterId = e.id
    // the object we get back for each event
    return {
      name: name,
      artist: artist,
      genre: genre,
      date: date,
      time: time,
      city: city,
      venue: venue,
      imageUrl: imageUrl,
      ticketUrl: ticketUrl,
      ticketmasterId: ticketmasterId
    }
  })
  // bulk write to DB
  const result = await Event.bulkWrite(
    newObject.map(event => ({
      updateOne: {
        filter: { ticketmasterId: event.ticketmasterId },
        update: { $set: event },
        upsert: true
      }
    }))
  )
  // end connection
  console.log(`Upserted: ${result.upsertedCount}, Updated: ${result.modifiedCount}`)
  await mongoose.disconnect()
}
// run fule
seedEvents().catch(err => {
  console.error(err)
  mongoose.disconnect()
})