require('dotenv').config()
const jwt = require('jsonwebtoken')
const process = require('process')

const verifyUserToken = (req, res, next) => {
  if (!req.headers.authorization && !req.cookies.accessToken) {
    return res.status(403).send({
      message: 'No se ha entregado el token.'
    })
  }

  const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization.split(' ')[1]

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'No tiene permiso.'
      })
    }

    req.userId = decoded.id
    next()
  })
}

const authJwt = {
  verifyUserToken
}

module.exports = authJwt
