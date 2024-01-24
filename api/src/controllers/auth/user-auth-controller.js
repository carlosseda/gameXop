const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

exports.signin = (req, res) => {
  const email = req.body.email

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).send({ message: 'La dirección de correo electrónico no es válida.' })
  }

  User.findOne({
    where: {
      email
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

      req.session.user = user.id

      res.status(200).send({
        email: user.email
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
