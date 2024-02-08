const Bowser = require('bowser')

const userAgentMiddleware = (req, res, next) => {
  const isRobot = /bot|crawler|spider|crawling/i.test(req.headers['user-agent'])
  req.isRobot = isRobot
  req.userLanguage = req.headers['accept-language'] ? (req.headers['accept-language'].split(',')[0]).split('-')[0] : 'es'
  req.userAgent = Bowser.parse(req.headers['user-agent'])

  const breakpoints = [
    { minWidth: 1200, size: 'lg' },
    { minWidth: 992, size: 'md' },
    { minWidth: 768, size: 'sm' },
    { minWidth: 0, size: 'xs' }
  ]

  if (req.body.screenWidth) {
    req.session.screenWidth = breakpoints.find(breakpoint => req.body.screenWidth >= breakpoint.minWidth).size
  }

  next()
}

module.exports = userAgentMiddleware
