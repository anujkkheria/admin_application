import { user } from '../schema/userSchema.js'

export const getall = async (req, res) => {
  try {
    const users = await user.find()
    res.status(200).json(users)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}

export const updateUser = async (req, res) => {
  const { name, email, role } = req.body
  const id = req.query.id
  try {
    const updatedUser = await user.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    )
    res.status(200).json(updatedUser)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}
