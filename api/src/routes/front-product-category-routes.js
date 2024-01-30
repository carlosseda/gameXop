module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/front/product-category-controller.js')

  router.get('/', controller.findAll)

  app.use('/api/front/product-categories', router)
}
