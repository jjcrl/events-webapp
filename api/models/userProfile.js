const mongoose = require("mongoose")

const UserProfileSchema = new mongoose.Schema({
  authUserId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  favouriteArtists: { type: [String], default: [] },
  homeLocation: {
    city: String,
    coordinates: {
      type: { type: String, enum: ["Point"] },
      coordinates: [Number]
    }
  }
}, {
  timestamps: true
})

const UserProfile = mongoose.model("UserProfile", UserProfileSchema)

module.exports = UserProfile