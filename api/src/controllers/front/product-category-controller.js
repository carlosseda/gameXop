const db = require('../../models')
const ProductCategory = db.ProductCategory

exports.findAll = (req, res) => {
  ProductCategory.findAll({
    attributes: [],
    where: {
      visible: true
    },
    include: [
      {
        attributes: ['key', 'value'],
        model: db.Locale,
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
