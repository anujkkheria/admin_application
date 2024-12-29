import winston from 'winston'
import 'winston-mongodb'
const Password = process.env.DB_PASS
const DB = process.env.DB_URI.replace('<password>', Password)

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Log to a file
    new winston.transports.File({ filename: 'logs/app.log' }),

    // Log to MongoDB
    new winston.transports.MongoDB({
      level: 'info',
      db: DB,
      collection: 'logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
})

export default logger
