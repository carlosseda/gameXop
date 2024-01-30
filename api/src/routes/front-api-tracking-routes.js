module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/front/api-tracking-controller.js')

  router.post('/', controller.create)

  app.use('/api/front/api-trackings', router)
}
