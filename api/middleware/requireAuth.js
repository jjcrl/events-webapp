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
  req.user = session.user
  next()
}
module.exports = requireAuth