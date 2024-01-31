const mongooseDb = require('../../models/mongoose')
const Faq = mongooseDb.Faq

exports.findAll = async (req, res) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }

    const result = await Faq.find(whereStatement)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const response = result.map(doc => ({
      ...doc,
      locales: doc.locales[req.userLanguage]
    }))

    res.status(200).send(response)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}
