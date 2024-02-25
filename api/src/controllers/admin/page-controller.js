const mongooseDb = require('../../models/mongoose')
const LocaleSeo = mongooseDb.LocaleSeo

exports.getPage = async (req, res) => {
  const startTime = Date.now()
  const url = req.params[0] ? `/admin/${req.params[0]}` : '/admin'

  const adminPage = await LocaleSeo.findOne({ url })

  // if (!adminPage) {
  //   const errorPage = await req.pageService.getStaticPage('404')
  //   return res.status(404).send(errorPage)
  // }

  const page = await req.pageService.getPage('admin', adminPage.entity, req.userLanguage)

  // const page = await pageService.generatePage(adminPage.dataValues, req.cookies)
  // const log = createLog(req, adminPage.dataValues.localeSeoId, startTime)
  // req.trackingService.createPageLog(log)
  return res.status(200).send(page)
}

function createLog (req, localeSeoId, startTime) {
  return {
    userId: req.userId,
    fingerprint: req.body.data?.fingerprint ?? req.cookies.fingerprint ?? null,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    isRobot: req.isRobot,
    localeSeoId,
    startTime,
    endTime: Date.now(),
    latencyMS: Date.now() - startTime
  }
}
