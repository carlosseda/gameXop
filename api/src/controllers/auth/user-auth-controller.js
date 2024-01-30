const bcrypt = require('bcryptjs')
const sequelizeDb = require('../../models/sequelize')
const User = sequelizeDb.User

exports.signin = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Los campos no pueden estar vacios.' })
  }

  if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
    return res.status(400).send({ message: 'La dirección de correo electrónico no es válida.' })
  }

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(401).send({ message: 'Usuario o contraseña incorrecta' })
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

      req.session.user = { id: user.id, admin: true }

      res.status(200).send({
        redirection: '/admin'
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.checkSignin = (req, res) => {
  if (req.session.user) {
    res.status(200).send({
      redirection: '/admin'
    })
  } else {
    res.status(401).send({
      redirection: '/login'
    })
  }
}
