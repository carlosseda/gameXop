module.exports = (app, upload) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const controller = require('../controllers/admin/menu-controller.js')

  router.post('/', [authCookie.verifyUserCookie], controller.create)
  router.get('/', [authCookie.verifyUserCookie], controller.findAll)
  router.get('/:id', [authCookie.verifyUserCookie], controller.findOne)
  router.put('/:id', [authCookie.verifyUserCookie], controller.update)
  router.delete('/:id', [authCookie.verifyUserCookie], controller.delete)
  router.get('/display/:name', [authCookie.verifyUserCookie], controller.getMenuItems)

  app.use('/api/admin/menus', router)
}
