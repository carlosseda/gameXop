// const mongooseDb = require('../models/mongoose')
// const Resource = mongooseDb.Resource
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const path = require('path')
const componentsDirectory = `${path.dirname(require.main.filename)}/src/components`

module.exports = class ComponentService {
  uploadComponent = async (file) => {
    try {
      const componentCode = file.buffer.toString('utf8')
      const ast = parser.parse(componentCode, { sourceType: 'module', plugins: ['objectRestSpread'] })

      let optionSettings = ''
      let componentName = ''
      let slot = false
      let data = false
      let paginate = false

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

          if (path.isClassMethod({ kind: 'method' }) &&
          path.get('key').isIdentifier({ name: 'connectedCallback' })) {
            const connectedCallbackBody = path.get('body').node
            const connectedCallbackCode = generate(connectedCallbackBody).code
            data = connectedCallbackCode.includes('this.getAttribute(\'data\')')
          }

          if (path.isClassMethod({ kind: 'method' }) &&
          path.get('key').isIdentifier({ name: 'connectedCallback' })) {
            const connectedCallbackBody = path.get('body').node
            const connectedCallbackCode = generate(connectedCallbackBody).code
            paginate = connectedCallbackCode.includes('this.currentPage')
          }
        }
      })

      if (!optionSettings) {
        return null
      }

      let component = generate(optionSettings).code
      component = component.replace(/(\w+):/g, '"$1":')
      component = component.replace(/'([^']+)'/g, '"$1"')
      component = JSON.parse(component)
      component.element = componentName
      component.slot = slot
      component.data = data
      component.paginate = paginate
      component.optionsForm = await this.generateOptionsForm(component)

      return component
    } catch (err) {
      console.log(err)
    }
  }

  generateOptionsForm = async component => {
    const optionsForm = {}
    optionsForm.tabs = []
    optionsForm.inputs = {}

    if (component.styles) {
      const tab = {
        name: 'styles',
        label: 'Estilos'
      }

      optionsForm.tabs.push(tab)
      optionsForm.inputs.styles = []

      Object.keys(component.styles).forEach((key) => {
        const input = {
          name: key,
          label: key.replace(/([A-Z])/g, ' $1').toLowerCase(),
          element: 'input',
          type: component.styles[key].type,
          value: component.styles[key].default,
          width: 'full-width'
        }

        optionsForm.inputs.styles.push(input)
      })
    }

    return optionsForm
  }
}
