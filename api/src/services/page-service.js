const { Window } = require('happy-dom')
const { build } = require('vite')
const fs = require('fs').promises
const path = require('path')
const componentsDirectory = `${path.dirname(require.main.filename)}/src/components`
const pagesDirectory = `${path.dirname(require.main.filename)}/src/pages`

module.exports = class PageService {
  constructor () {
    this.environment = null
  }

  createPageHtml = async (page, environment, structure) => {
    if (Object.keys(structure).length === 0 || typeof structure !== 'object') return
    this.environment = environment
    this.entity = page.entity

    Array.from(page.locales.keys()).forEach(async languageAlias => {
      this.languageAlias = languageAlias
      try {
        const window = new Window()
        const document = window.document
        const doctype = document.implementation.createDocumentType('html', '', '')
        document.appendChild(doctype)

        document.documentElement.setAttribute('lang', languageAlias)

        const viewport = document.createElement('meta')
        viewport.setAttribute('name', 'viewport')
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0')

        const title = document.createElement('title')
        title.textContent = page.locales.get(languageAlias).title

        const metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        metaDescription.setAttribute('content', page.locales.get(languageAlias).description)

        const script = document.createElement('script')
        script.setAttribute('type', 'module')

        document.head.appendChild(viewport)
        document.head.appendChild(title)
        document.head.appendChild(metaDescription)
        document.head.appendChild(script)

        this.body = document.createElement('body')

        await this.loadComponentsScripts(structure, document)
        await this.loadComponents(structure, document)

        const directory = `${pagesDirectory}/${this.environment}/${this.languageAlias}/${this.entity}`
        await fs.mkdir(`${directory}`, { recursive: true })
        await fs.writeFile(`${directory}/index.html`, document.documentElement.outerHTML)
      } catch (err) {
        console.log(err)
      }
    })
  }

  loadComponentsScripts = async (structure, document) => {
    let importsContent = ''

    for (const component of Object.keys(structure)) {
      const componentPath = path.join(componentsDirectory, this.environment, `${component}.js`)
      importsContent += `import './${path.relative(componentsDirectory, componentPath)}';\n`
    }

    const indexPath = path.join(componentsDirectory, 'index.js')
    await fs.writeFile(indexPath, importsContent)

    await build({
      configFile: false,
      root: componentsDirectory,
      build: {
        outDir: `${pagesDirectory}/${this.environment}/${this.languageAlias}/${this.entity}`,
        assetsDir: '.',
        rollupOptions: {
          input: indexPath
        },
        minify: 'terser'
      }
    })

    const script = document.createElement('script')
    script.setAttribute('type', 'module')
    script.setAttribute('src', '/dist/index.js')
  }

  loadComponents = async (structure, document, parent = null) => {
    for (const [component, attributes] of Object.entries(structure)) {
      if (Array.isArray(attributes)) {
        const multipleComponents = attributes
        for (const attributes of multipleComponents) {
          await this.createElement(document, component, attributes, parent)
        }
      } else {
        await this.createElement(document, component, attributes, parent)
      }
    }
  }

  createElement = async (document, component, attributes, parent) => {
    const element = document.createElement(component)

    if (parent) {
      parent.appendChild(element)
    } else {
      document.body.appendChild(element)
    }

    for (let [key, value] of Object.entries(attributes)) {
      if (key === 'slot' && typeof value === 'object' && value !== null) {
        await this.loadComponentsScripts(value, document)
        await this.loadComponents(value, document, element)
      } else {
        if (typeof value === 'object' && value !== null) value = JSON.stringify(value).replace(/"/g, "'")
        element.setAttribute(key, value)
      }
    }
  }
}
