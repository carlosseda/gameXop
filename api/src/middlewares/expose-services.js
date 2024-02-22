const services = {
  trackingService: new (require('../services/tracking-service'))(),
  imageService: new (require('../services/image-service'))(),
  priceManagementService: new (require('../services/price-management-service'))(),
  productManagementService: new (require('../services/product-management-service'))(),
  localeSeoService: new (require('../services/locale-seo-service'))(),
  pageService: new (require('../services/page-service'))()
}

function createServiceMiddleware (serviceName) {
  return (req, res, next) => {
    req[serviceName] = services[serviceName]
    next()
  }
}

module.exports = Object.keys(services).reduce((middlewares, serviceName) => {
  middlewares[`${serviceName}Middleware`] = createServiceMiddleware(serviceName)
  return middlewares
}, {})
