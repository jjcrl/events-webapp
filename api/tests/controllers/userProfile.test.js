jest.mock("../../models/userProfile")

const UserProfile = require("../../models/userProfile")
const profileController = require("../../controllers/userProfile")

describe("profile controller", () => {
    let req, res

    // set up req and res for mocking http calls
    beforeEach(() => {
        req = {
            user: { id: "user-123" },
            body: {},
            params: {}
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        // Reset all mock methods before each test
        UserProfile.findOne.mockReset?.()
        UserProfile.findOneAndUpdate.mockReset?.()
    })
    describe("getMyProfile", () => {
        test("returns the user's profile", async () => {
            // set up the profile
            const fakeProfile = {
                authUserId: "user-123",
                favouriteArtists: ["Idles"]
            }
            //1. Program the scenario — method findOne , result should = fakeProfile
            UserProfile.findOne.mockResolvedValue(fakeProfile)

            // 2. Run the controller
            await profileController.getMyProfile(req, res)
            
            // 3. Assert what happened

            //expect it was called with an authUserId
            expect(UserProfile.findOne).toHaveBeenCalledWith({ authUserId: "user-123" })
            //expect the response (res), to return the profile we asked for 
            expect(res.json).toHaveBeenCalledWith({ profile: fakeProfile })
        })
        test('should return 404 if no user profile is found', async () => {
            //1. Program the scenario — method fineOne -> given no authUserId to find with
            UserProfile.findOne.mockResolvedValue(null)
            // 2. Run the controller
            await profileController.getMyProfile(req, res)
            // res . status for code 
            expect(res.status).toHaveBeenCalledWith(404)
            // res.json for response object.
            expect(res.json).toHaveBeenCalledWith({ error: "User's profile not found" })
        });
    })
    describe('updateFavouriteArtist', () => {
        test('should update the favourite artist array', async () => {
            const updatedProfile = {
                authUserId: "user-123",
                favouriteArtists: ["Idles", "Beyonce"]
            }
            //1. Program the scenario — method findOneAndUpdate -> should return the updated profile
            UserProfile.findOneAndUpdate.mockResolvedValue(updatedProfile)
            // set up req body for what the update will be.
            req.body = { artists: ['Idles', 'Beyonce'] }
          
            //2. run the controller 
            await profileController.updateFavouriteArtists(req, res)
          
            //verify the controller behaivour
            expect(UserProfile.findOneAndUpdate).toHaveBeenCalledWith(
                { authUserId: "user-123" },
                { favouriteArtists: ["Idles", "Beyonce"] },
                { new: true })
            // Verify the controller responded with the updated profile
            expect(res.json).toHaveBeenCalledWith({ profile: updatedProfile })
        });
        test('should return 404 if no nartists are given to update', async () => {
            const updatedProfile = {
                authUserId: "user-123",
                favouriteArtists: ["Idles", "Beyonce"]
            }
            //1. Program the scenario — "the DB has this profile for this user"
            UserProfile.findOneAndUpdate.mockResolvedValue(updatedProfile)
            // await the controller func
            await profileController.updateFavouriteArtists(req, res)
            // So we check what the controller TRIED to do
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "User must provide artists to update with" })
        });
    });

    describe('updateLocation', () => {
        test('should update the homeLocation object', async () => {
            //updated profile for testing
            const updatedProfile = {
                authUserId: "user-123",
                homeLocation: {
                    city: "London",
                    lat: 51.5072,
                    long: 0.1276
                }
            }

            //1. Program the scenario — "the DB has this profile for this user"

            // Translation: "Hey fake findOneAndUpdate — next time you're called, 
            //               return a promise that resolves to updatedProfile"
            UserProfile.findOneAndUpdate.mockResolvedValue(updatedProfile)

            // set up req body for what the update will be.
            req.body = {
                homeLocation: {
                    city: "London",
                    lat: 51.5072,
                    long: 0.1276
                }
            }

            await profileController.updateLocation(req, res)
            // Internally, the controller does:
            //   const profile = await UserProfile.findOneAndUpdate(...)
            //   ^ this hits the fake, which gives back updatedProfile
            //   So profile === updatedProfile now

            // 3. Assert what the controller did with that data
            expect(UserProfile.findOneAndUpdate).toHaveBeenCalledWith(
                { authUserId: "user-123" },
                {
                    homeLocation: {
                        city: "London",
                        lat: 51.5072,
                        long: 0.1276
                    }
                },
                { new: true })

            // Verify the controller responded with the updated profile
            expect(res.json).toHaveBeenCalledWith({ profile: updatedProfile })
        });
        test('should return a 404 if the user does not provide a location to update', async () => {
            //updated profile for testing
            const updatedProfile = {
                authUserId: "user-123",
                homeLocation: {
                    city: "Manchester",
                    lat: 53.483959,
                    long: -2.244644
                }
            }
            UserProfile.findOneAndUpdate.mockResolvedValue(updatedProfile)
            await profileController.updateLocation(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "User must provide a new location" })
        });
    });
})