const moment = require('moment')
const mongooseDb = require('../../models/mongoose')
const Component = mongooseDb.Component

exports.create = async (req, res) => {
  try {
    const component = await req.componentService.uploadComponent(req.files.file[0])

    if (!component) {
      return res.status(400).send({
        message: 'El archivo no es un componente válido.'
      })
    }

    await Component.create(component)
    res.status(200).send(component)
  } catch (err) {
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al insertar el dato.'
    })
  }
}

exports.findAll = async (req, res) => {
  const whereStatement = {}
  whereStatement.deletedAt = { $exists: false }

  try {
    const result = await Component.find(whereStatement)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const response = {
      rows: result.map(doc => ({
        ...doc,
        id: doc._id,
        _id: undefined,
        createdAt: moment(doc.createdAt).format('YYYY-MM-DD HH:mm'),
        updatedAt: moment(doc.updatedAt).format('YYYY-MM-DD HH:mm')
      }))
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
    const data = await Component.findById(id).lean().exec()

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
    const data = await Component.findByIdAndUpdate(id, req.body, { new: true })

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
    res.status(500).send({
      message: 'Algún error ha surgido al actualizar la id=' + id
    })
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id

  try {
    const data = await Component.findByIdAndUpdate(id, { deletedAt: new Date() })

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
