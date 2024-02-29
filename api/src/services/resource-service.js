const mongooseDb = require('../models/mongoose')
const Resource = mongooseDb.Resource
const naming = require('../utils/naming')
const fs = require('fs')
const path = require('path')
const templatesDirectory = `${path.dirname(require.main.filename)}/src/templates`
const routeTemplate = fs.readFileSync(`${templatesDirectory}/route-template.js`, 'utf8')
const controllerTemplate = fs.readFileSync(`${templatesDirectory}/controller-template.js`, 'utf8')
const modelTemplate = fs.readFileSync(`${templatesDirectory}/model-template.js`, 'utf8')
const routeDirectory = `${path.dirname(require.main.filename)}/src/routes`
const controllerDirectory = `${path.dirname(require.main.filename)}/src/controllers`
const modelDirectory = `${path.dirname(require.main.filename)}/src/models`

module.exports = class ResourceService {
  create = async (data) => {
    try {
      const entityName = data.entity
      const singularizeEntityName = await naming.singularize(entityName)
      const routeFilename = `admin-${singularizeEntityName}-route.js`
      const controllerFilename = `${singularizeEntityName}-controller.js`
      const modelFilename = `${singularizeEntityName}.js`
      const modelName = await naming.kebabCaseToCamelCase(singularizeEntityName)

      const routeFile = routeTemplate
        .replace(/{{controllerFilename}}/g, controllerFilename)
        .replace(/{{entityName}}/g, entityName)

      const controllerFile = controllerTemplate
        .replace(/{{modelName}}/g, modelName)

      console.log(data.schema)

      const modelFile = modelTemplate
        .replace(/{{modelName}}/g, modelName)
        .replace(/{{entityName}}/g, entityName)
        .replace(/{{schema}}/g, data.schema)

      // fs.writeFileSync(`${routeDirectory}/${routeFilename}`, routeFile)
      // fs.writeFileSync(`${controllerDirectory}/${controllerFilename}`, controllerFile)
      fs.writeFileSync(`${modelDirectory}/${modelFilename}`, modelFile)
    } catch (err) {
      console.log(err)
    }
  }

  lastUpdate = async (endpoint) => {
    try {
      const product = await Resource.findOneAndUpdate(
        { endpoint },
        { $set: { lastUpdated: Date.now() } },
        { new: true }
      )

      return product
    } catch (err) {
      console.log(err)
    }
  }
}
