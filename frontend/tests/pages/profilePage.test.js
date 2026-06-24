import createFetchMock from "vitest-fetch-mock";
import { describe, vi, expect, test } from "vitest";
import { getMyProfile } from "../../src/services/userProfile";
const BACKEND_URL = import.meta.env.VITE_API_URL;
createFetchMock(vi).enableMocks();

describe("userProfile services", () => {
    describe("getMyProfile", () => {
        test("fetches /me with credentials", async () => {
            fetch.mockResponseOnce(
                JSON.stringify({ profile: { _id: "abc" } }),
                { status: 200 },
            );

            await getMyProfile();

            const [url, options] = fetch.mock.lastCall;
            expect(url).toEqual(`${BACKEND_URL}/me`);
            expect(options.method).toEqual("GET");
            expect(options.credentials).toEqual("include");
        });
    });
});
