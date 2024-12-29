import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  },
  actionType: { type: String, required: true },
  ip: { type: String, required: true },
  endpoint: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

export const Log = mongoose.model('Log', logSchema)
