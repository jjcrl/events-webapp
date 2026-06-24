import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import EventCard from "../../src/components/EventCard/EventCard"

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
    ...actual,
    useNavigate: () => vi.fn(),
    };
});

describe("EventCard", () =>{
    const event = {
        name: "Coldplay Live",
        artist: "Coldplay",
        genre: "Britpop",
        date:"2026-08-01",
        time: "19:30",
        city: "Manchester",
        venue: "A0 Arena",
        imageUrl: "https://example.com/coldplay.jpg",
        ticketUrl: "https:ticketmaster.com/event/123",
    };

    test("render event details", () => {
        render(<EventCard event={event} />);
    
        expect(screen.getByText("Coldplay Live")).toBeTruthy();
        expect(screen.getByText("Coldplay")).toBeTruthy();
        expect(screen.getByText("Britpop")).toBeTruthy();
        expect(screen.getByText(/1 Aug 2026/)).toBeTruthy();
        expect(screen.getByText(/19:30/)).toBeTruthy();
        expect(screen.getByText(/A0 Arena.*Manchester/)).toBeTruthy();
    });

    // test("render ticket link when ticketUrl exists", ()=>{
    //     render(<EventCard event={event} />);
    //     const link = screen.getByRole("link", { name: /buy tickets/i });
    //     expect(link.getAttribute("href")).toBe(event.ticketUrl);
    // });

    test("render image when imageUrl exists", () =>{
        render(<EventCard event={event} />);
        const image = screen.getByRole("img", { name: /Coldplay Live/i });
        expect(image.getAttribute("src")).toBe(event.imageUrl);
    });

    test("renders nothing if event is missing", ()=>{
        const { container } = render(<EventCard event={null} />);
        expect(container.innerHTML).toBe("");
    });
})