const mongoose = require("mongoose");
const Event = require("../../models/event");

require("../mongodb_helper");

function validEvent(overrides = {}) {
    return {
        name: "Fontaines D.C. Live",
        artist: "Fontaines D.C.",
        genre: "Rock/Pop",
        date: new Date("2026-08-28"),
        time: "09:30",
        city: "Manchester",
        venue: "Richfield Avenue",
        imageUrl: "https://example.com/image.jpg",
        ticketUrl: "https://ticketmaster.com/event/123",
        ticketmasterId: `tm-${Date.now()}-${Math.random()}`, // unique ID per test
        ...overrides,
    };
}

beforeEach(async () => {
    await Event.deleteMany({});
});


describe("Event model", () => {
    describe("valid event", () => {
        test("saves successfully all fields", async () => {
            const event = new Event(validEvent());
            const saved = await event.save();

            expect(saved._id).toBeDefined();
            expect(saved.name).toBe("Fontaines D.C. Live");
            expect(saved.artist).toBe("Fontaines D.C.");
            expect(saved.city).toBe("Manchester");
            expect(saved.genre).toBe("Rock/Pop");
        });

        test("saves without optional fields (time, venue, imageUrl, ticketUrl", async () => {
            const event = new Event(
                validEvent({ time: undefined, venue: undefined, imageUrl: undefined, ticketUrl: undefined })
                );
                const saved = await event.save();
                expect(saved._id).toBeDefined();
        });
        
        test("adds createdAt and updatedAt timestamps automatically", async  => {
            const event = new Event(validEvent());
            const saved = await event.save();

            expect(saved.createdAt).toBeDefined();
            expect(saved.updatedAt).toBeDefined();
        });    
    });
});