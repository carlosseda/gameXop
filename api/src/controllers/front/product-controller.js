const moment = require('moment')
const mongooseDb = require('../../models/mongoose')
const ProductSpecification = mongooseDb.ProductSpecification

exports.findAll = async (req, res) => {
  try {
    const language = req.query.language ?? req.userLanguage
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }

    const result = await ProductSpecification.find(whereStatement)
      .populate('platforms')
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const response = result.map(doc => ({
      id: doc._id,
      url: doc.links[language] || null,
      title: doc.locales[language].title,
      images: doc.images?.xs?.[language] || [],
      discountPercentage: doc.price.discountPercentage || null,
      priceAfterDiscount: doc.price.discountPercentage ? doc.price.basePrice * doc.price.multiplier : null,
      endsAt: doc.price.endsAt ? moment(doc.price.endsAt).format('DD-MM-YY') : null,
      price: doc.price.basePrice,
      categories: doc.categories,
      platforms: doc.platforms.map(platform => ({
        filename: platform.images.xs[language].icon.filename,
        title: platform.images.xs[language].icon.title,
        alt: platform.images.xs[language].icon.alt || null
      }))
    }))

    res.status(200).send(response)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: err.message || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}
