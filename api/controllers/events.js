
// Ticketmaster mapping to the events controller


// const events = data._embedded.events.map(event => ({
//   name: event.name,
//   artist: event._embedded?.attractions?.[0]?.name || event.name,
//   genre: event._embedded?.attractions?.[0]?.classifications?.[0]?.genre?.name || "Other",
//   date: event.dates?.start?.localDate,
//   time: event.dates?.start?.localTime,
//   city: event._embedded?.venues?.[0]?.city?.name,
//   venue: event._embedded?.venues?.[0]?.name,
//   imageUrl: event.images?.[0]?.url,
//   ticketUrl: event.url,
//   ticketmasterId: event.id,
// }))