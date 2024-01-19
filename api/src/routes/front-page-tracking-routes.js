module.exports = (app, upload) => {
  const router = require('express').Router()
  const controller = require('../controllers/front/page-tracking-controller.js')

  router.post('/', controller.create)

  app.use('/api/front/page-trackings', router)
}
