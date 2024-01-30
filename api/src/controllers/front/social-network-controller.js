const sequelizeDb = require('../../models/sequelize')
const SocialNetwork = sequelizeDb.SocialNetwork

exports.findAll = (req, res) => {
  SocialNetwork.findAll({
    attributes: ['baseUrl'],
    include: [
      {
        attributes: [['resizedFilename', 'filename'], 'name', 'alt', 'title'],
        model: sequelizeDb.Image,
        as: 'images',
        where: {
          languageAlias: req.userLanguage,
          mediaQuery: 'lg'
        },
        required: false
      }
    ]
  })
    .then(async result => {
      result = await Promise.all(result.map(async item => {
        item.dataValues.images = await req.imageService.parseImages(item.images)
        return item
      }))

      res.status(200).send(result)
    }).catch(err => {
      res.status(500).send({
        message: err.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}
