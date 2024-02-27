module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/front/image-gallery-controller.js')

  router.get('/image/:filename', controller.getImage)

  app.use('/api/front/image-gallery', router)
}
