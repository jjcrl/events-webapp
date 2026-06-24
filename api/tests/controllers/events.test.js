jest.mock("../../models/event");

// We mock the Event model so these tests don't touch the database, but verify the logic

const Event = require("../../models/event");
const { getEvents, getEventById } = require("../../controllers/events");

const fakeEvents = [
    {
        _id: "event-id-1",
        name: "Coldplay Live",
        artist: "Coldplay",
        city: "Manchester",
        date: new Date("2026-08-01"),
        genre: "Britpop",
    },
    {
        _id: "event-id-2",
        name: "The Cure Live",
        artist: "The Cure",
        city: "London",
        date: new Date("2026-10-01"),
        genre: "Rock",
    },
];    

function makeReqRes(query = {}, params = {}) {
    const req = { query, params };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    return { req, res };
}

// Tests for getEvents
describe("getEvents", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test("returns 200 and all events when no filters are provided", async () => {
        Event.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue(fakeEvents)
        });

        const { req, res } = makeReqRes();
        await getEvents(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ events: fakeEvents });
    });

    test("passes a city filter when city query param is provided", async () => {
        Event.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([fakeEvents[0]]) });

        const { req, res } = makeReqRes({ city: "Manchester" });
        await getEvents(req, res);

        // Verifying that Event.find was called with a city filter (regex)
        const filterArg = Event.find.mock.calls[0][0];
        expect(filterArg.city).toEqual({ $regex: expect.any(RegExp) });
        // The regex should match "Manchester" case-insensitively
        expect(filterArg.city.$regex.test("Manchester")).toBe(true);
        expect(filterArg.city.$regex.test("manchester")).toBe(true);
    });

    test("passes a date range filter when from and to are provided", async () => {
        Event.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeEvents) });

        const { req, res } = makeReqRes({ from: "2026-08-01", to: "2026-10-01" });
        await getEvents(req, res);

        const filterArg = Event.find.mock.calls[0][0];
        expect(filterArg.date.$gte).toEqual(new Date ("2026-08-01"));
        expect(filterArg.date.$lte).toEqual(new Date ("2026-10-01"));
    });

    test("passes only $gte when only from is provided", async () => {
        Event.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeEvents) });

        const { req, res } = makeReqRes({ from: "2026-08-01" });
        await getEvents(req, res);

        const filterArg = Event.find.mock.calls[0][0];
        expect(filterArg.date.$gte).toBeDefined();
        expect(filterArg.date.$lte).toBeUndefined();
    });

    test("returns 500 when the database throws", async () => {
        Event.find.mockReturnValue({
            sort: jest.fn().mockRejectedValue(new Error("DB connection lost")),
        });

        const { req, res } = makeReqRes();
        await getEvents(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch events" });
    });
});

// Tests for getEventById
describe("getEventById", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns 200 and the event when found", async () => {
        Event.findById.mockResolvedValue(fakeEvents[0]);

        const { req, res } = makeReqRes({}, { id: "event-id-1" });
        await getEventById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ events: fakeEvents[0] });
    });

    test("returns 404 when no event matches the id", async () => {
        Event.findById.mockResolvedValue(null);

        const { req, res } = makeReqRes({}, { id: "non-existent id" });
        await getEventById(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
    });

    test("returns 400 when the id is not a valid ObjectId", async () => {
        const castError = new Error("Cast to ObjectId failed");
        castError.name = "CastError";
        Event.findById.mockRejectedValue(castError);

        const { req, res } = makeReqRes({}, { id: "not-an-objectId" });
        await getEventById(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid event ID" });
    });

    test("returns 500 when the database throws an unexpected error", async () => {
        Event.findById.mockRejectedValue(new Error("Unexpected DB error"));

        const { req, res } = makeReqRes({}, { id: "event-id-1" });
        await getEventById(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch event" });
    });
});