const mongooseDb = require('../../models/mongoose')
const ProductCategory = mongooseDb.ProductCategory

exports.findAll = async (req, res) => {
  const whereStatement = {}
  whereStatement.deletedAt = { $exists: false }

  try {
    const result = await ProductCategory.find()
      .select('locales')
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const response = result.map((doc) => ({
      id: doc._id,
      title: doc.locales[req.userLanguage].title
    }))

    res.status(200).send(response)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}
