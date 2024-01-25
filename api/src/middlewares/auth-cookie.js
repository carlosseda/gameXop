const verifyUserCookie = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.status(403).send('No autorizado')
  }
}

const authCookie = {
  verifyUserCookie
}

module.exports = authCookie
