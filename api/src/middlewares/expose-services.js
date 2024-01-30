const TrackingService = require('../services/tracking-service')
const ImageService = require('../services/image-service')
const LocaleService = require('../services/locale-service')
const PriceManagementService = require('../services/price-management-service')

const trackingService = new TrackingService()
const imageService = new ImageService()
const localeService = new LocaleService()
const priceManagementService = new PriceManagementService()

const trackingServiceMiddleware = (req, res, next) => {
  req.trackingService = trackingService
  next()
}

const imageServiceMiddleware = (req, res, next) => {
  req.imageService = imageService
  next()
}

const localeServiceMiddleware = (req, res, next) => {
  req.localeService = localeService
  next()
}

const priceManagementServicMiddleware = (req, res, next) => {
  req.priceManagementService = priceManagementService
  next()
}

module.exports = {
  trackingServiceMiddleware,
  imageServiceMiddleware,
  localeServiceMiddleware,
  priceManagementServicMiddleware
}
