module.exports = (app) => {
  const router = require('express').Router()
  const authJwt = require('../middlewares/auth-jwt.js')
  const uploadFiles = require('../middlewares/upload-files.js')
  const controller = require('../controllers/admin/image-gallery-controller.js')

  router.post('/', [authJwt.verifyUserToken, uploadFiles], controller.create)
  router.get('/', [authJwt.verifyUserToken], controller.findAll)
  router.get('/:filename', controller.findOne)
  router.delete('/:filename', [authJwt.verifyUserToken], controller.delete)

  app.use('/api/admin/image-gallery', router)
}
