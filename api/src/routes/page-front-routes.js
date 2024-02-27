module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/front/page-controller.js')

  router.get('/*', controller.getPage)

  app.use('/', router)
}
