const moment = require('moment')
const mongooseDb = require('../../models/mongoose')
const ProductSpecification = mongooseDb.ProductSpecification

exports.findAll = async (req, res) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }

    const result = await ProductSpecification.find(whereStatement)
      .populate('platforms')
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const response = result.map(doc => ({
      id: doc._id,
      url: doc.links[req.userLanguage] || null,
      title: doc.locales[req.userLanguage].title,
      images: doc.images?.[req.session.screenWidth]?.[req.userLanguage] || [],
      discountPercentage: doc.price.discountPercentage || null,
      priceAfterDiscount: doc.price.discountPercentage ? doc.price.basePrice * doc.price.multiplier : null,
      endsAt: doc.price.endsAt ? moment(doc.price.endsAt).format('DD-MM-YY') : null,
      price: doc.price.basePrice,
      categories: doc.categories,
      platforms: doc.platforms.map(platform => ({
        filename: platform.images[req.session.screenWidth][req.userLanguage].icon.filename,
        title: platform.images[req.session.screenWidth][req.userLanguage].icon.title,
        alt: platform.images[req.session.screenWidth][req.userLanguage].icon.alt || null
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
