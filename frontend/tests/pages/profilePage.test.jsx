import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

import { ProfilePage } from "../../src/pages/Profile/ProfilePage";

vi.mock("../../src/services/authentication", () => ({
    authClient: {
        useSession: vi.fn(),
    },
}));

vi.mock("../../src/services/userProfile", () => ({
    getMyProfile: vi.fn(),
    getMyBookings: vi.fn(),
}));

import { authClient } from "../../src/services/authentication";
import { getMyProfile, getMyBookings } from "../../src/services/userProfile";

const defaultSession = {
    data: { user: { name: "Test User", email: "user@test.com" } },
    isPending: false,
};

describe("Profile Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authClient.useSession.mockReturnValue(defaultSession);
    });

    test("displays user profile information when data loads", async () => {
        // Mock the profile data
        getMyProfile.mockResolvedValue({
            profile: {
                authUserId: "fakeUserId",
                homeLocation: {
                    city: "London",
                    lat: 51.5072,
                    long: 0.1276
                },
                favouriteArtists: ["Beyonce", "Mariah Carey"],
                bookings: []
            }
        });
        getMyBookings.mockResolvedValue({ bookings: [] });
        
        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        expect(await screen.findByText("Your location: London")).toBeInTheDocument();
        expect(screen.getByText("Beyonce")).toBeInTheDocument();
        expect(screen.getByText("Mariah Carey")).toBeInTheDocument();
        expect(screen.getByText("Your name: Test User")).toBeInTheDocument();
    });

    test("shows error message when fetching profile fails", async () => {
        getMyProfile.mockRejectedValue(new Error("Unable to fetch user's profile"));
        getMyBookings.mockResolvedValue({ bookings: [] });

        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        expect(
            await screen.findByText("Unable to fetch user's profile")
        ).toBeInTheDocument();
    });

    test("shows 'No upcoming bookings' when bookings list is empty", async () => {
        getMyProfile.mockResolvedValue({
            profile: {
                authUserId: "fakeUserId",
                homeLocation: { city: "London", lat: 51.5072, long: 0.1276 },
                favouriteArtists: [],
                bookings: []
            }
        });
        getMyBookings.mockResolvedValue({ bookings: [] });
 
        render(<MemoryRouter><ProfilePage /></MemoryRouter>);
 
        expect(await screen.findByText(/No upcoming bookings/i)).toBeInTheDocument();
        expect(screen.getByText(/No past bookings/i)).toBeInTheDocument();
    });
 
    test("renders upcoming bookings with artist, venue, and date", async () => {
        getMyProfile.mockResolvedValue({
            profile: {
                authUserId: "fakeUserId",
                homeLocation: { city: "London", lat: 51.5072, long: 0.1276 },
                favouriteArtists: [],
                bookings: []
            }
        });
        getMyBookings.mockResolvedValue({
            bookings: [
                {
                    _id: "event-1",
                    name: "Summer Tour 2026",
                    artist: "Idles",
                    venue: { name: "O2 Arena" },
                    date: "2026-08-01T19:00:00.000Z",
                    time: "19:00",
                    isPast: false,
                }
            ]
        });
 
        render(<MemoryRouter><ProfilePage /></MemoryRouter>);
 
        expect(await screen.findByText("Idles")).toBeInTheDocument();
        expect(screen.getByText(/Summer Tour 2026/i)).toBeInTheDocument();
        // venue should appear somewhere in the booking item
        expect(screen.getByText(/O2 Arena/i)).toBeInTheDocument();
    });
 
    test("renders past bookings in the past bookings section", async () => {
        getMyProfile.mockResolvedValue({
            profile: {
                authUserId: "fakeUserId",
                homeLocation: { city: "London", lat: 51.5072, long: 0.1276 },
                favouriteArtists: [],
                bookings: []
            }
        });
        getMyBookings.mockResolvedValue({
            bookings: [
                {
                    _id: "event-old",
                    name: "Old Gig",
                    artist: "Blur",
                    venue: { name: "Brixton Academy" },
                    date: "2020-01-01T20:00:00.000Z",
                    time: "20:00",
                    isPast: true,
                }
            ]
        });
 
        render(<MemoryRouter><ProfilePage /></MemoryRouter>);
 
        const pastSection = await screen.findByRole("region", { name: /past bookings/i });
        expect(pastSection).toBeInTheDocument();
        expect(screen.getByText("Blur")).toBeInTheDocument();
        expect(screen.getByText(/Brixton Academy/i)).toBeInTheDocument();
    });
});