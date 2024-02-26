const ResourceService = require('../services/resource-service')

const resourceMiddleware = (req, res, next) => {
  res.on('finish', async function () {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      const resourceService = new ResourceService()
      if (req.baseUrl.startsWith('/api')) {
        await resourceService.lastUpdate(req.baseUrl)
      }
    }
  })

  next()
}

module.exports = resourceMiddleware
