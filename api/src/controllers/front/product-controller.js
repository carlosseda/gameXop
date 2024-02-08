const mongooseDb = require('../../models/mongoose')
const ProductSpecification = mongooseDb.ProductSpecification

exports.findAll = async (req, res) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }

    const result = await ProductSpecification.find(whereStatement)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const response = result.map(doc => ({
      title: doc.locales[req.userLanguage].title,
      images: doc.images[req.session.screenWidth][req.userLanguage],
      categories: doc.categories,
      platforms: doc.platforms
    }))

    console.log(response)

    res.status(200).send(response)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}
