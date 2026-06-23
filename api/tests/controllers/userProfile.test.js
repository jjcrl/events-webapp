jest.mock("../../models/userProfile")

const UserProfile = require("../../models/userProfile")
const profileController = require("../../controllers/userProfile")

describe("profile controller", () => {
    let req, res

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
            const fakeProfile = {
                authUserId: "user-123",
                favouriteArtists: ["Idles"]
            }
            //1. Program the scenario — "the DB has this profile for this user"
            UserProfile.findOne.mockResolvedValue(fakeProfile)
            // 2. Run the controller
            await profileController.getMyProfile(req, res)
            // 3. Assert what happened
            expect(UserProfile.findOne).toHaveBeenCalledWith({ authUserId: "user-123" })
            expect(res.json).toHaveBeenCalledWith({ profile: fakeProfile })
        })
        test('should return 404 if no user profile is found', async () => {
            //1. Program the scenario — "the DB has this profile for this user"
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
            //1. Program the scenario — "the DB has this profile for this user"
            UserProfile.findOneAndUpdate.mockResolvedValue(updatedProfile)
            // set up req body for what the update will be.
            req.body = { artists: ['Idles', 'Beyonce'] }
            await profileController.updateFavouriteArtists(req, res)
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
})