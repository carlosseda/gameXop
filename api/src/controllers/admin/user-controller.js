const db = require('../../models')
const User = db.User
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  User.create(req.body).then(data => {
    req.imageService.resizeImages('users', data.id, req.body.images)
    res.status(200).send(data)
  }).catch(error => {
    if (error.errors) {
      res.status(422).send({
        message: error.errors
      })
    } else {
      res.status(500).send({
        message: 'Algún error ha surgido al recuperar los datos.'
      })
    }
  })
}

exports.findAll = (req, res) => {
  const page = req.query.page || 1
  const limit = parseInt(req.query.size) || 10
  const offset = (page - 1) * limit
  const whereStatement = {}

  for (const key in req.query) {
    if (req.query[key] !== '' && key !== 'page' && key !== 'size') {
      whereStatement[key] = { [Op.substring]: req.query[key] }
    }
  }

  const condition = Object.keys(whereStatement).length > 0 ? { [Op.and]: [whereStatement] } : {}

  User.findAndCountAll({
    where: condition,
    attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  })
    .then(result => {
      result.meta = {
        total: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: page
      }

      res.status(200).send(result)
    }).catch(error => {
      res.status(500).send({
        message: error.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']
  }).then(async data => {
    if (data) {
      data.dataValues.images = await req.imageService.getAdminImages('users', id)
      res.status(200).send(data)
    } else {
      res.status(404).send({
        message: `No se puede encontrar el elemento con la id=${id}.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al recuperar la id=' + id
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id

  if (req.body.password === '') {
    delete req.body.password
  }

  User.findByPk(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `No se encontró el usuario con la id=${id}.`
        })
      }

      Object.assign(user, req.body)

      return user.save()
    })
    .then(async result => {
      if (req.body.images?.length > 0) {
        await req.imageService.deleteImages('users', id)
        await req.imageService.resizeImages('users', id, req.body.images)
      }

      res.status(200).send({
        message: 'El elemento ha sido actualizado correctamente.'
      })
    })
    .catch((_) => {
      res.status(500).send({
        message: 'Algún error ha surgido al actualizar la id=' + id
      })
    })
}

exports.delete = (req, res) => {
  const id = req.params.id

  User.destroy({
    where: { id }
  }).then(numberRowsAffected => {
    if (numberRowsAffected === 1) {
      res.status(200).send({
        message: 'El elemento ha sido borrado correctamente'
      })
    } else {
      res.status(404).send({
        message: `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al borrar la id=' + id
    })
  })
}

exports.userArea = (req, res) => {
  const id = req.session.user.id

  User.findByPk(id, {
    attributes: ['name'],
    include: [
      {
        attributes: [['resizedFilename', 'filename'], 'name', 'alt', 'title'],
        model: db.Image,
        as: 'images',
        where: {
          languageAlias: req.userLanguage,
          mediaQuery: 'lg'
        },
        required: false
      }
    ]
  }).then(async data => {
    if (data) {
      data.dataValues.images = await req.imageService.parseImages(data.images)
      res.status(200).send(data)
    } else {
      res.status(404).send({
        message: `No se puede encontrar el elemento con la id=${id}.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al recuperar la id=' + id
    })
  })
}
