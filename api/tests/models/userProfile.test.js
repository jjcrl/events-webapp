// api/tests/models/userProfile.test.js
const mongoose = require("mongoose")
const UserProfile = require("../../models/userProfile")

require("../mongodb_helper")

describe("UserProfile model", () => {
  beforeEach(async () => {
    await UserProfile.deleteMany({})
  })

  
})