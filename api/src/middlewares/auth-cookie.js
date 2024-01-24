const verifyUserCookie = (req, res, next) => {
  console.log('req.session.user', req.session)
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
