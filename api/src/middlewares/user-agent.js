const Bowser = require('bowser')

const userAgentMiddleware = (req, res, next) => {
  const isRobot = /bot|crawler|spider|crawling/i.test(req.headers['user-agent'])
  req.isRobot = isRobot

  const acceptLanguage = req.headers['accept-language']
  req.userLanguage = acceptLanguage ? acceptLanguage.split(',')[0].split('-')[0] : 'es'

  req.userAgent = Bowser.parse(req.headers['user-agent'])

  next()
}

module.exports = userAgentMiddleware
