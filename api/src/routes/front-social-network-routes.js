module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/front/social-network-controller.js')

  router.get('/', controller.findAll)

  app.use('/api/front/social-networks', router)
}
