import { user } from '../schema/userSchema.js'
import logger from '../utils/logger.js'
import sgMail from '@sendgrid/mail'
import jwt from 'jsonwebtoken'
sgMail.setApiKey(process.env.EMAIL_APIKEY)
export const Signup = async (req, res) => {
  try {
    const newUser = await user.create({ ...req.body })
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    })
    console.log(newUser)
    logger.info({
      actionType: 'Signup',
      userId: newUser._id,
      email,
      ip: req.ip,
      endpoint: req.originalUrl,
    })
    return res.status(201).json({
      status: 'success',
      token,
      body: {
        user: newUser,
      },
    })
  } catch (e) {
    console.log(req)
    return res.status(500).json({ message: e.message })
  }
}

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email && password) {
      const User = await user.findOne({ email }).select('+password')
      if (User) {
        const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRESIN,
        })
        const authenticated = await User.comparePassword(
          User.password,
          password
        )
        if (!authenticated) {
          logger.info({
            actionType: 'Login worng info',
            userId: User._id,
            email,
            ip: req.ip,
            endpoint: req.originalUrl,
          })
          return res.status(401).json({
            message: 'wrong email/password',
          })
        }
        logger.info({
          actionType: 'User Login Success',
          userId: User._id,
          email,
          ip: req.ip,
          endpoint: req.originalUrl,
        })
        return res.status(200).json({
          message: 'logged in',
          body: {
            id: User._id,
            name: User.name,
            email: User.email,
            token,
          },
        })
      }
    }
  } catch (e) {
    logger.warn({
      actionType: 'User Login Failed',
      email: req.body.email,
      error: e.message,
      ip: req.ip,
      endpoint: req.originalUrl,
    })
    return res.status(500).json({ message: e.message })
  }
}

export const requestreset = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.send(400).json({ message: 'bad request' })
  }
  try {
    const User = user.findOne({ email })
    if (!user) {
      return res.send(200)
    }
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    })
    const resetUrl = `https://${process.env.BASE_URL}/resetpassword?id=${User._id}&token=${token}`
    // console.log(resetUrl)
    // const transporter = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: process.env.RESET_EMAIL,
    //     pass: 'process.env.RESET_PASSWORD',
    //   },
    // })
    const mailOptions = {
      to: email,
      from: process.env.RESET_EMAIL,
      subject: 'password reset request',
      text: `You are receiveing this email to reset password copy and paste the url ${resetUrl} \n ignore this mail if not requested by you`,
      html: `<p>You are receiveing this email to reset password copy and paste the url <a href="${resetUrl}" target="_blank">reset link</a> ignore this mail if not requested by you</p>`,
    }
    await sgMail.send(mailOptions)
    // await transporter.sendMail(mailOptions)
    logger.info({
      actionType: 'Password Reset Request',
      email,
      ip: req.ip,
      endpoint: req.originalUrl,
    })
    return res.status(200).json({ message: 'done' })
  } catch (e) {
    console.log(e, process.env.RESET_EMAIL, process.env.RESET_PASS)
    logger.error({
      actionType: 'Password Reset Failed',
      error: e.message,
      ip: req.ip,
      endpoint: req.originalUrl,
    })
    return res.Status(400)
  }
}

export const resetpassword = async (req, res) => {
  const { token, userId } = req.query
  const { password, confirmPassword } = req.body

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({
      message: 'Missing required fields',
    })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match',
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.id !== userId) {
      return res.status(401).json({
        message: 'Invalid token',
      })
    }

    // Find and update user
    const User = await user.findById(userId)
    if (!User) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    // Update password
    User.password = password
    User.confirmPassword = confirmPassword
    await User.save()

    logger.info({
      actionType: 'Password Reset Success',
      userId: User._id,
      ip: req.ip,
      endpoint: req.originalUrl,
    })

    return res.status(200).json({
      message: 'Password reset successful',
    })
  } catch (e) {
    logger.error({
      actionType: 'Password Reset Failed',
      userId,
      error: e.message,
      ip: req.ip,
      endpoint: req.originalUrl,
    })

    if (e.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid or expired token',
      })
    }

    return res.status(500).json({
      message: 'Password reset failed',
      error: e.message,
    })
  }
}
