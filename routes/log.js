import express from 'express'

const router = express.Router()
router.route('/').get((req, res) => {
  return res.status(200).json({ message: 'you hav reached /logs' })
})
export default router
