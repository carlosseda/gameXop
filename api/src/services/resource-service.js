const mongooseDb = require('../models/mongoose')
const Resource = mongooseDb.Resource

module.exports = class ResourceService {
  lastUpdate = async (endpoint) => {
    try {
      const product = await Resource.findOneAndUpdate(
        { endpoint },
        { $set: { lastUpdated: Date.now() } },
        { new: true }
      )

      return product
    } catch (err) {
      console.log(err)
    }
  }
}
