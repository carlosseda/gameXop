const ResourceService = require('../services/resource-service')

const updateResource = async (req, res, next) => {
  const resourceService = new ResourceService()

  if (req.baseUrl.startsWith('/api')) {
    await resourceService.lastUpdate(req.baseUrl)
  }

  next()
}

const resource = {
  updateResource
}

module.exports = resource
