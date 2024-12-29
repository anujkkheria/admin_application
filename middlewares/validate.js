import { user } from '../schema/userSchema.js'
export async function adminValidator(req, res, next) {
  const userID = req.body.userid
  if (!userID) {
    return res.status(404).json({ message: '/route not found' })
  }
  try {
    const User = await user.findOne({ _id: userID })
    if (!User) {
      return res.status(404).json({ message: 'no user found' })
    }
    if (User.role !== 'admin') {
      return res.status(404).json({ message: 'route not found' })
    }
    next()
  } catch {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}
