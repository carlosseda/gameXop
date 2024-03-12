// const mongooseDb = require('../models/mongoose')
// const Resource = mongooseDb.Resource
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const { Window } = require('happy-dom')
const fs = require('fs').promises
const path = require('path')
const componentsDirectory = `${path.dirname(require.main.filename)}/src/components`

module.exports = class ComponentService {
  uploadComponent = async (file) => {
    try {
      const componentCode = file.buffer.toString('utf8')
      const ast = parser.parse(componentCode, { sourceType: 'module', plugins: ['objectRestSpread'] })

      let optionSettings = ''
      let componentName = ''
      let slot = ''

      traverse(ast, {
        enter (path) {
          if (path.isCallExpression() &&
              path.get('callee').isMemberExpression() &&
              path.get('callee.object').isIdentifier({ name: 'customElements' }) &&
              path.get('callee.property').isIdentifier({ name: 'define' }) &&
              path.node.arguments.length > 0 &&
              path.get('arguments.0').isStringLiteral()) {
            componentName = path.node.arguments[0].value
          }

          if (path.isAssignmentExpression() &&
              path.get('left').isMemberExpression() &&
              path.get('left.object').isThisExpression() &&
              path.get('left.property').isIdentifier({ name: 'optionSettings' })) {
            optionSettings = path.get('right').node
          }

          if (path.isClassMethod({ kind: 'method' }) &&
          path.get('key').isIdentifier({ name: 'render' })) {
            const renderBody = path.get('body').node
            const renderCode = generate(renderBody).code
            slot = renderCode.includes('<slot></slot>')
          }
        }
      })

      if (optionSettings) {
        optionSettings = generate(optionSettings).code
      }

      console.log(optionSettings, componentName, slot)
    } catch (err) {
      console.log(err)
    }
  }
}
