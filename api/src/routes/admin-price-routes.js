module.exports = (app, upload) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const controller = require('../controllers/admin/price-controller.js')

  router.post('/', [authCookie.verifyUserToken], controller.create)
  router.get('/', [authCookie.verifyUserToken], controller.findAll)
  router.get('/:id', [authCookie.verifyUserToken], controller.findOne)
  router.put('/:id', [authCookie.verifyUserToken], controller.update)
  router.delete('/:id', [authCookie.verifyUserToken], controller.delete)

  app.use('/api/admin/prices', router)
}
