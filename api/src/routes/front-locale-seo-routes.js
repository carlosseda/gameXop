module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/front/locale-seo-controller.js')

  router.post('/', controller.findAll)

  app.use('/api/front/routes', router)
}
