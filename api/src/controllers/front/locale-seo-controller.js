const mongooseDb = require('../../models/mongoose')
const LocaleSeo = mongooseDb.LocaleSeo

exports.findAll = async (req, res) => {
  const result = await LocaleSeo.find({ environment: 'front', languageAlias: req.userLanguage })

  const response = result.map(item => {
    const baseUrls = [
      { url: item.url }
    ]
    // TODO
    const slugUrls = item.slugs.map(slug => {
      return {
        url: `${item.url}/${slug.url}`,
        filename: item.filename
      }
    })

    return [...baseUrls, ...slugUrls]
  }).flat()

  console.log(response)

  res.status(200).send(response)
}
