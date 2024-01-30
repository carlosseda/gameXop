module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/front/product-controller.js')

  router.get('/', controller.findAll)

  app.use('/api/front/products', router)
}
