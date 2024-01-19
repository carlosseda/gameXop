module.exports = (app, upload) => {
  const router = require('express').Router()
  const controller = require('../controllers/front/customer-tracking-controller.js')

  router.post('/', controller.create)

  app.use('/api/front/customer-trackings', router)
}
