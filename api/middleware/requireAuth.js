const { fromNodeHeaders } = require("better-auth/node")
const { auth } = require("../lib/auth")
const UserProfile = require("../models/userProfile")

const requireAuth = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  })
  
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" })
  }
  
  // ensure a UserProfile exists for this user
  let profile = await UserProfile.findOne({ authUserId: session.user.id })
  if (!profile) {
    profile = await UserProfile.create({
      authUserId: session.user.id,
    })
  }
  
  req.user = session.user
  req.profile = profile
  next()
}

module.exports = requireAuth