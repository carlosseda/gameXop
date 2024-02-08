const mongooseDb = require('../../models/mongoose')
const SocialNetwork = mongooseDb.SocialNetwork

exports.findAll = async (req, res) => {
  const whereStatement = {}
  whereStatement.deletedAt = { $exists: false }

  try {
    const result = await SocialNetwork.find()
      .select('url images')
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const response = result.map((doc) => ({
      url: doc.url,
      filename: doc.images.lg[req.userLanguage].icon.resizedFilename,
      alt: doc.images[req.session.screenWidth][req.userLanguage].icon.alt,
      title: doc.images[req.session.screenWidth][req.userLanguage].icon.title
    }))

    res.status(200).send(response)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}
