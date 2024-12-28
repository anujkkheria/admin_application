import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import DB from './DB.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/users.js'

const app = express()
app.use(express.json())
dotenv.config()
app.use(cors())

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'your api are working',
  })
})

app.use('/auth', authRouter)
app.use('/users', userRouter)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`listenning on port ${port}`)
})
