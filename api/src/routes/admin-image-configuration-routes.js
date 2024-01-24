module.exports = (app, upload) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const controller = require('../controllers/admin/image-configuration-controller.js')

  router.post('/', [authCookie.verifyUserToken], controller.create)
  router.put('/:id', [authCookie.verifyUserToken], controller.update)
  router.delete('/:id', [authCookie.verifyUserToken], controller.delete)

  app.use('/api/admin/image-configurations', router)
}
