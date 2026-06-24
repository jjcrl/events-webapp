// api/tests/models/userProfile.test.js
const mongoose = require("mongoose")
const UserProfile = require("../../models/userProfile")

require("../mongodb_helper")

describe("UserProfile model", () => {
  beforeEach(async () => {
    await UserProfile.deleteMany({})
  })
  test('requires a authUserId', async () => {
    const profile = new UserProfile({})
    await expect(profile.save()).rejects.toThrow()
  });
  test('favouriteArtists defaults to an empty array', async () => {
    const profile = new UserProfile({ authUserId: "abc" })
    await profile.save()
    expect(profile.favouriteArtists).toEqual([])
  });
  test('home location field default to manchester', async () => {
    const profile = new UserProfile({ authUserId: 'def' })
    await profile.save()
    // console.log(profile.homeLocation)
    expect(profile.homeLocation.city).toBe("Manchester")
    expect(profile.homeLocation.lat).toBe(53.483959)
    expect(profile.homeLocation.long).toBe(-2.244644)
  });
  test('bookings defaults to an empty array', async () => {
    const profile = new UserProfile({ authUserId: "abc" })
    await profile.save()
    expect(profile.bookings).toEqual([])
  })
})