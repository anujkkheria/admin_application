import express from 'express'

const router = express.router()
router.route('/').get((req, res) => {
  res.send(200).json({ message: 'you hav reached /logs' })
})
export default router
