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
        
        test("adds createdAt and updatedAt timestamps automatically", async () => {
            const event = new Event(validEvent());
            const saved = await event.save();

            expect(saved.createdAt).toBeDefined();
            expect(saved.updatedAt).toBeDefined();
        });    
    });
});

// fails without name / artist / city / genre / date (in one describe block)
describe("required field validation", () => {
    test("fails wihtout name", async () => {
        const event = new Event(validEvent({ name: undefined }));
        // Expecting the promise to be rejected and throw an error:
        // name: checks the word "name" is in the error
        // .*: means any characters in between
        // required: checks that the word "required" is in the message
        // /i: makes the search case-insensitive
        await expect(event.save()).rejects.toThrow(/name.*required/i);
    });

    test("fails without artist", async () => {
        const event = new Event(validEvent({ artist: undefined }));
        await expect(event.save()).rejects.toThrow(/artist.*required/i);
    });
    
    test("fails without city", async () => {
        const event = new Event(validEvent({ city: undefined }));
        await expect(event.save()).rejects.toThrow(/city.*required/i);
    });
    
    test("fails without genre", async () => {
        const event = new Event(validEvent({ genre: undefined }));
        await expect(event.save()).rejects.toThrow(/genre.*required/i);
    });

    test("fails without date", async () => {
        const event = new Event(validEvent({ date: undefined }));
        await expect(event.save()).rejects.toThrow(/date.*required/i);
    });
});

// test ticketmaster id is unique
describe("ticketmasterId uniqueness", () => {
    test("rejects a duplicate ticketmasterId", async () => {
        const sharedId = "tm-duplicate-123";
        await new Event(validEvent({ ticketmasterId: sharedId })).save();
        const duplicate = new Event(validEvent({ name: "Another Event", ticketmasterId: sharedId }));
        await expect(duplicate.save()).rejects.toThrow(/duplicate key/i);
    });
});