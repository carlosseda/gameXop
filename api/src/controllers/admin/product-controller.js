const sequelizeDb = require('../../models/sequelize')
const Product = sequelizeDb.Product
const Op = sequelizeDb.Sequelize.Op

exports.create = (req, res) => {
  console.log(req.body)
  Product.create(req.body).then(async data => {
    try {
      await req.productManagementService.createSpecifications(data.id, req.body)
      await req.priceManagementService.createPrice(data.id, req.body.price)
      await req.imageService.resizeImages('products', data.id, req.body.images)
      res.status(200).send(data)
    } catch (err) {
      console.log(err)
    }
  }).catch(err => {
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al insertar el dato.'
    })
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

  Product.findAndCountAll({
    where: condition,
    attributes: ['id', 'name', 'createdAt', 'updatedAt'],
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
    }).catch(err => {
      res.status(500).send({
        message: err.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Product.findByPk(id, {
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    include: [
      {
        attributes: ['languageAlias', 'key', 'value'],
        model: sequelizeDb.Locale,
        as: 'locales',
        required: false
      }
    ]
  }).then(async data => {
    if (data) {
      data = await req.productManagementService.getSpecifications(data, id)
      data = await req.imageService.getAdminImages(data, 'products', id)

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

  Product.update(req.body, {
    where: { id }
  }).then(async ([numberRowsAffected]) => {
    if (numberRowsAffected === 1) {
      console.log(req.body.specifications)

      await req.priceManagementService.createPrice(id, req.body.price)
      await req.localeService.update('products', id, req.body.locales)
      await req.imageService.deleteImages('products', id)
      await req.imageService.resizeImages('products', id, req.body.images)

      res.status(200).send({
        message: 'El elemento ha sido actualizado correctamente.'
      })
    } else {
      res.status(404).send({
        message: `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento o el cuerpo de la petición está vacío.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al actualiazar la id=' + id
    })
  })
}

exports.delete = (req, res) => {
  const id = req.params.id

  Product.destroy({
    where: { id }
  }).then(async ([numberRowsAffected]) => {
    if (numberRowsAffected === 1) {
      await req.localeService.delete('products', id)

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
