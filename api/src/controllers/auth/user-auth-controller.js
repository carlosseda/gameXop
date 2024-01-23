require('dotenv').config()
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Usuario o contraseña incorrecta' })
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )

      if (!passwordIsValid) {
        return res.status(404).send({
          message: 'Usuario o contraseña incorrecta'
        })
      }

      req.session.user = user

      res.status(200)
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
