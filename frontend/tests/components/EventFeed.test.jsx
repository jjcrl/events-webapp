import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import EventFeed from "../../src/components/EventFeed"

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
    ...actual,
    useNavigate: () => vi.fn(),
    };
});

const fakeEvents = [
    { _id: "1", name: "Arctic Monkeys Live", artist: "Arctic Monkeys", city: "Manchester" },
    { _id: "2", name: "Coldplay Live", artist: "Coldplay", city: "London" }
]

describe("EventFeed", () => {
    test("renders a list of event cards", () => {
    render(<EventFeed events={fakeEvents} />)
    expect(screen.getByText("Arctic Monkeys Live")).toBeTruthy()
    expect(screen.getByText("Coldplay Live")).toBeTruthy()
    })

    test("shows message when no events found", () => {
    render(<EventFeed events={[]} />)
    expect(screen.getByText("No events found")).toBeTruthy()
    })
})