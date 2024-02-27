const ResourceService = require('../services/resource-service')

const resourceMiddleware = (req, res, next) => {
  res.on('finish', async function () {
    if (req.baseUrl && req.baseUrl.startsWith('/api/admin') && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
      const resourceService = new ResourceService()
      await resourceService.lastUpdate(req.baseUrl)
    }
  })

  next()
}

module.exports = resourceMiddleware
