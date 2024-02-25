module.exports = (app) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const controller = require('../controllers/admin/user-controller.js')
  const resource = require('../middlewares/resource.js')

  router.get('/user-area', [authCookie.verifyUserCookie], controller.userArea)
  router.post('/', [authCookie.verifyUserCookie, controller.create, resource.updateResource()])
  router.get('/', [authCookie.verifyUserCookie], controller.findAll)
  router.get('/:id', [authCookie.verifyUserCookie], controller.findOne)
  router.put('/:id', [authCookie.verifyUserCookie, controller.update, resource.updateResource()])
  router.delete('/:id', [authCookie.verifyUserCookie, controller.delete, resource.updateResource()])

  app.use('/api/admin/users', router)
}
