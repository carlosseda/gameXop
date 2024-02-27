module.exports = (app) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const controller = require('../controllers/admin/page-controller.js')

  // router.get('/*', [authCookie.verifyUserCookie], controller.getPage)

  // app.use('/admin', router)
}
