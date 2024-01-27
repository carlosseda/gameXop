module.exports = (app, upload) => {
  const auth = require('../controllers/auth/user-auth-controller.js')

  app.post('/api/auth/users/signin', auth.signin)
  app.get('/api/auth/users/check-signin', auth.checkSignin)
}
