import { user } from '../schema/userSchema.js'
import sgMail from '@sendgrid/mail'
import jwt from 'jsonwebtoken'
sgMail.setApiKey(process.env.EMAIL_APIKEY)
export const Signup = async (req, res, next) => {
  try {
    console.log({ ...req.body })
    const newUser = await user.create({ ...req.body })
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    })
    console.log(newUser)
    res.status(201).json({
      status: 'success',
      token,
      body: {
        user: newUser,
      },
    })
  } catch (e) {
    console.log(e)
    console.log(req.body)
  }
}

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (email && password) {
      const User = await user.findOne({ email }).select('+password')
      console.log(User)
      if (User) {
        const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRESIN,
        })
        console.log(User.id)
        const authenticated = await User.comparePassword(
          User.password,
          password
        )
        authenticated
          ? res.status(200).json({
              message: 'logged in',
              body: {
                id: User._id,
                name: User.name,
                email: User.email,
                token,
              },
            })
          : res.status(402).json({
              message: 'wrong email/password',
            })
      }
    }
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const requestreset = async (req, res) => {
  const { email } = req.body
  // if (!email) {
  //   res.send(400).json({ message: 'bad request' })
  // }
  try {
    const User = user.findOne({ email })
    if (!user) {
      res.send(200)
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
      to: 'anujkheria1@gmail.com',
      from: process.env.RESET_EMAIL,
      subject: 'password reset request',
      text: `You are receiveing this email to reset password copy and paste the url ${resetUrl} \n ignore this mail if not requested by you`,
      html: `<p>You are receiveing this email to reset password copy and paste the url <a href="${resetUrl}" target="_blank"> reset link</a> </p> ignore this mail if not requested by you`,
    }
    await sgMail.send(mailOptions)
    // await transporter.sendMail(mailOptions)

    return res.status(200).json({ message: 'done' })
  } catch (e) {
    console.log(e, process.env.RESET_EMAIL, process.env.RESET_PASS)
    return res.Status(400)
  }
}
