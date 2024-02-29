const moment = require('moment')
const mongooseDb = require('../../models/mongoose')
const AdminPage = mongooseDb.AdminPage

exports.create = async (req, res) => {
  try {
    if (req.body.structure) req.body.structure = JSON.parse(req.body.structure.replace(/'/g, '"'))
    const data = await AdminPage.create(req.body)
    await req.localeSeoService.createUrl(data, 'admin')
    await req.pageService.createStaticPageHtml(data, 'admin', req.body.structure, req.headers.cookie)

    res.status(200).send(data)
  } catch (err) {
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al insertar el dato.'
    })
  }
}

exports.findAll = async (req, res) => {
  const page = req.query.page || 1
  const limit = parseInt(req.query.size) || 10
  const offset = (page - 1) * limit
  const whereStatement = {}
  whereStatement.deletedAt = { $exists: false }

  for (const key in req.query) {
    if (req.query[key] !== '' && key !== 'page' && key !== 'size') {
      whereStatement[key] = { $regex: req.query[key], $options: 'i' }
    }
  }

  try {
    const result = await AdminPage.find(whereStatement)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const count = await AdminPage.countDocuments(whereStatement)

    const response = {
      rows: result.map(doc => ({
        ...doc,
        id: doc._id,
        _id: undefined,
        createdAt: moment(doc.createdAt).format('YYYY-MM-DD HH:mm'),
        updatedAt: moment(doc.updatedAt).format('YYYY-MM-DD HH:mm')
      })),
      meta: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page
      }
    }

    res.status(200).send(response)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}

exports.findOne = async (req, res) => {
  const id = req.params.id

  try {
    const data = await AdminPage.findById(id).lean().exec()
    data.structure = JSON.stringify(data.structure)

    if (data) {
      data.id = data._id
      delete data._id
    }

    if (data) {
      res.status(200).send(data)
    } else {
      res.status(404).send({
        message: `No se puede encontrar el elemento con la id=${id}.`
      })
    }
  } catch (err) {
    res.status(500).send({
      message: 'Algún error ha surgido al recuperar la id=' + id
    })
  }
}

exports.update = async (req, res) => {
  const id = req.params.id

  try {
    if (req.body.structure) req.body.structure = JSON.parse(req.body.structure.replace(/'/g, '"'))
    const data = await AdminPage.findByIdAndUpdate(id, req.body, { new: true })
    await req.localeSeoService.createUrl(data, 'admin')
    await req.pageService.createStaticPageHtml(data, 'admin', req.body.structure, req.headers.cookie)

    if (data) {
      res.status(200).send({
        message: 'El elemento ha sido actualizado correctamente.'
      })
    } else {
      res.status(404).send({
        message: `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento o el cuerpo de la petición está vacío.`
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: 'Algún error ha surgido al actualizar la id=' + id
    })
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id

  try {
    const data = await AdminPage.findByIdAndUpdate(id, { deletedAt: new Date() })
    req.localeSeoService.deleteUrl(data)

    if (data) {
      res.status(200).send({
        message: 'El elemento ha sido borrado correctamente.'
      })
    } else {
      res.status(404).send({
        message: `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento.`
      })
    }
  } catch (err) {
    res.status(500).send({
      message: 'Algún error ha surgido al borrar la id=' + id
    })
  }
}
