const mongoose = require("mongoose")

const UserProfileSchema = new mongoose.Schema({
})

const UserProfile = mongoose.model("UserProfile", UserProfileSchema)

module.exports = UserProfile