const UserProfile = require("../models/userProfile")

const getMyProfile = async (req, res) => {
    try {
        // find the userprofile by the auth id
        const profile = await UserProfile.findOne({ authUserId: req.user.id })

        //if no profile found
        if (!profile) {
            return res.status(404).json({ error: "User's profile not found" })
        }
        return res.json({ profile })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

const updateFavouriteArtists = async (req, res) => {
    try {
        // take artists of req body
        const { artists } = req.body

        // if no artists provided
        if (!artists) {
            return res.status(400).json({ error: "User must provide artists to update with" })
        }

        // args for api func
        const profile = await UserProfile.findOneAndUpdate(
            //1. filter -> what does it need to find 
            { authUserId: req.user.id },
            //2. what does it need to update?
            { favouriteArtists: artists },
            // options -> return new profile not old one. 
            { new: true }
        )
        // return the found and updated profile
        return res.json({ profile })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}


const updateLocation = async (req, res) => {
    try {
        const { homeLocation } = req.body
        if (!homeLocation) {
            return res.status(400).json({ error: "User must provide a new location" })
        }
        const profile = await UserProfile.findOneAndUpdate(
            { authUserId: req.user.id },
            { homeLocation },
            { new: true }
        )
        return res.json({ profile })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

module.exports = { updateLocation, getMyProfile, updateFavouriteArtists }