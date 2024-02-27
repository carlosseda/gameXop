exports.create = async (req, res) => {
  try {
    const result = await req.imageService.uploadImage(req.files)

    res.status(200).send(result)
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Algún error ha surgido al insertar el dato.',
      errors: error.errors
    })
  }
}

exports.findOne = async (req, res) => {
  const fileName = req.params.filename

  const options = {
    root: __dirname + '../../../storage/images/gallery/thumbnail/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  res.sendFile(fileName, options)
}

exports.findAll = async (req, res) => {
  req.imageService.getThumbnails().then(result => {
    res.status(200).send(result)
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Algún error ha surgido al recuperar los datos.'
    })
  })
}

exports.delete = (req, res) => {
  const filename = req.params.filename

  req.imageService.deleteImages(filename).then(result => {
    if (result === 1) {
      res.status(200).send({
        message: 'El elemento ha sido borrado correctamente'
      })
    } else {
      res.status(404).send({
        message: 'No se puede borrar el elemento'
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al borrar'
    })
  })
}

exports.getImage = async (req, res) => {
  const fileName = req.params.filename

  const options = {
    root: __dirname + '../../../storage/images/resized/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  res.sendFile(fileName, options)
}
