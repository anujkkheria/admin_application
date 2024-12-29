import express from 'express'
import {
  Signup,
  Login,
  requestreset,
  resetpassword,
} from '../controllers/auth.js'

const router = express.Router()
router.route('/').get((req, res) => {
  console.log('you reached the route')
  return res.status(200).json({ message: 'req recevied on auth' })
})
router.route('/Signup').post(Signup)
router.route('/Login').post(Login)
router.route('/forgot-password').post(requestreset)
router.route('/resetpassword').post(resetpassword)

export default router
