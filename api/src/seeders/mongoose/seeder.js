require('dotenv').config({ path: '../../../.env' })
const process = require('process')
const fs = require('fs')
const mongoose = require('mongoose')
const path = require('path')
const basename = path.basename(__filename)

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log('Conexión a MongoDB exitosa.')

  fs.readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js'
      )
    })
    .forEach(async seederFile => {
      const seeder = require(path.join(__dirname, seederFile))
      await seeder(mongoose)
    })
})
