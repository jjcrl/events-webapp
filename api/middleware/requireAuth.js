const { fromNodeHeaders } = require("better-auth/node")
const { auth } = require("../lib/auth")
const UserProfile = require("../models/userProfile")

const requireAuth = async (req, res, next) => {

  try {
    // create session var
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    })

    // if no session return 401
    if (!session) {
      return res.status(401).json({ error: "Not authenticated" })
    }
    // set user into session
    req.user = session.user
    next()
  } catch (err) {
    // pass to express
    next(err)
  }
}
module.exports = requireAuth