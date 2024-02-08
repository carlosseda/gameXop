// const sequelizeDb = require('../../models/sequelize')
// const LocaleSeo = sequelizeDb.LocaleSeo

exports.findAll = (req, res) => {
  req.body.screenWidth = req.body.screenWidth || 0
  req.screenWidth = req.body.screenWidth

  res.status(200).send({
    routes: [
      {
        path: '/',
        filename: 'home.html'
      },
      {
        path: '/juegos/',
        filename: '/game.html'
      }
    ]
  })
}
