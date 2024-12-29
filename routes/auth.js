import express from 'express'
import { Signup, Login, requestreset } from '../controllers/auth.js'

const router = express.Router()
router.route('/').get((req, res) => {
  return res.status(200).json({ message: 'req recevied on auth' })
  console.log('you reached the route')
})
router.route('/Signup').post(Signup)
router.route('/Login').post(Login)
router.route('/requestreset').post(requestreset)

export default router
