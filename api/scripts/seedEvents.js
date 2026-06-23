// api/scripts/seedEvents.js
require('dotenv').config()

const seedEvents = async () => {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY}&city=Manchester&countryCode=GB&size=5`
  
  console.log("URL:", url)
  
  const response = await fetch(url)
  const data = await response.json()
  
  console.log("Response:", JSON.stringify(data, null, 2))
}

seedEvents().catch(console.error)

// write seed data once you can access api?

