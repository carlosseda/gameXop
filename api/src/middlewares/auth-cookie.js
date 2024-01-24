require('dotenv').config()

const verifyUserToken = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.status(403).send('No autorizado')
  }
}

const authJwt = {
  verifyUserToken
}

module.exports = authJwt
