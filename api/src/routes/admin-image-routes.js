module.exports = (app, upload) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const controller = require('../controllers/admin/image-gallery-controller.js')

  const uploadFields = upload.fields([
    { name: 'file', maxCount: 1 }
  ])

  router.post('/', [authJwt.verifyUserToken, uploadFields], controller.create)
  router.get('/', [authCookie.verifyUserCookie], controller.findAll)
  router.get('/:filename', controller.findOne)
  router.delete('/:filename', [authCookie.verifyUserCookie], controller.delete)

  app.use('/api/admin/image-gallery', router)
}
