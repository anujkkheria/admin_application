import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import DB from './DB.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/users.js'
import logsRouter from './routes/log.js'
import { adminValidator } from './middlewares/validate.js'

const app = express()
app.use(express.json())
dotenv.config()
app.use(cors())

app.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'your api are working',
  })
})

app.use('/auth', authRouter)
app.use('/users', userRouter)

app.use('/logs', adminValidator, logsRouter)
const port = process.env.PORT

app.listen(port, () => {
  console.log(`listenning on port ${port}`)
})
