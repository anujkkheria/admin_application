import { Log } from '../schema/logSchema'

export const getallLogs = async (req, res) => {
  try {
    const logs = await Log.find()
    return res
      .status(200)
      .json({ message: 'successfully retrived', data: logs })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}
