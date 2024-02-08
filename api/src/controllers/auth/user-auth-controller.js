const bcrypt = require('bcryptjs')
const mongooseDb = require('../../models/mongoose')
const User = mongooseDb.User

exports.signin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Los campos no pueden estar vacios.' })
    }

    if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
      return res.status(400).send({ message: 'La dirección de correo electrónico no es válida.' })
    }

    const data = await User.findOne({
      email: req.body.email
    }).lean().exec()

    if (!data) {
      return res.status(404).send({ message: 'Usuario o contraseña incorrecta' })
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      data.password
    )

    if (!passwordIsValid) {
      return res.status(404).send({
        message: 'Usuario o contraseña incorrecta'
      })
    }

    req.session.user = { id: data._id, admin: true }

    res.status(200).send({
      redirection: '/admin'
    })
  } catch (err) {
    res.status(500).send({ message: err.message || 'Algún error ha surgido al recuperar los datos.' })
  }
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
