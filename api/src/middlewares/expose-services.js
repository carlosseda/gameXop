const TrackingService = require('../services/tracking-service')
const ImageService = require('../services/image-service')
const LocaleService = require('../services/locale-service')

const trackingService = new TrackingService()
const imageService = new ImageService()
const localeService = new LocaleService()

const trackingServiceMiddleware = (req, res, next) => {
  req.trackingService = trackingService
  next()
}

const imageServiceMiddleware = (req, res, next) => {
  req.imageService = imageService
  next()
}

const localeMiddleware = (req, res, next) => {
  req.localeService = localeService
  next()
}

module.exports = {
  trackingServiceMiddleware,
  imageServiceMiddleware,
  localeMiddleware
}
