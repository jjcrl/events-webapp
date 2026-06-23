// api/tests/models/userProfile.test.js
const mongoose = require("mongoose")
const UserProfile = require("../../models/userProfile")

require("../mongodb_helper")

describe("UserProfile model", () => {
  beforeEach(async () => {
    await UserProfile.deleteMany({})
  })

  test("requires authUserId", async () => {
    const profile = new UserProfile({})
    await expect(profile.save()).rejects.toThrow()
  })

  test("defaults favouriteArtists to empty array", async () => {
    const profile = await UserProfile.create({ authUserId: "abc" })
    expect(profile.favouriteArtists).toEqual([])
  })

  test("rejects duplicate authUserId", async () => {
    await UserProfile.create({ authUserId: "abc" })
    await expect(
      UserProfile.create({ authUserId: "abc" })
    ).rejects.toThrow()
  })
})