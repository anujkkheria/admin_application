import logger from './logAction'

export function logAction(actionType) {
  return async (req, _, next) => {
    try {
      const { user } = req
      const logData = {
        userId: user ? user._id : null,
        actionType,
        ip: req.ip,
        endpoint: req.originalUrl,
        timestamp: new Date(),
      }

      logger.info(logData) // Log the data
      next()
    } catch (error) {
      console.error('Logging error:', error)
      next()
    }
  }
}
