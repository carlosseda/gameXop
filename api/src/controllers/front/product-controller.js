const sequelizeDb = require('../../models/sequelize')
const Product = sequelizeDb.Product

exports.findAll = (req, res) => {
  Product.findAll({
    attributes: ['id', 'visible'],
    where: {
      visible: true
    },
    include: [
      {
        attributes: [['resizedFilename', 'filename'], 'name', 'alt', 'title'],
        model: sequelizeDb.Image,
        as: 'images',
        where: {
          languageAlias: req.userLanguage,
          mediaQuery: 'lg',
          name: 'home-product-gallery'
        },
        required: false
      },
      {
        attributes: ['key', 'value'],
        model: sequelizeDb.Locale,
        as: 'locales',
        where: {
          key: 'title',
          languageAlias: req.userLanguage
        },
        required: false
      }
    ]
  })
    .then(async result => {
      console.log(result)
      result = await req.localeService.parseLocales(result)

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
