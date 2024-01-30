const sequelizeDb = require('../../models/sequelize')
const ProductCategory = sequelizeDb.ProductCategory

exports.findAll = (req, res) => {
  ProductCategory.findAll({
    attributes: [],
    where: {
      visible: true
    },
    include: [
      {
        attributes: ['key', 'value'],
        model: sequelizeDb.Locale,
        as: 'locales',
        where: {
          languageAlias: req.userLanguage
        },
        required: false
      }
    ]
  })
    .then(async result => {
      result = await req.localeService.parseLocales(result)
      res.status(200).send(result)
    }).catch(err => {
      res.status(500).send({
        message: err.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}
