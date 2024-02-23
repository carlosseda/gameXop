const { Window } = require('happy-dom')
const { rollup } = require('rollup')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const terser = require('terser')
const fs = require('fs').promises
const path = require('path')
const componentsDirectory = `${path.dirname(require.main.filename)}/src/components`
const pagesDirectory = `${path.dirname(require.main.filename)}/src/pages`

module.exports = class PageService {
  constructor () {
    this.environment = null
  }

  createStaticPageHtml = async (page, environment, structure) => {
    console.time('createPageHtml')

    if (Object.keys(structure).length === 0 || typeof structure !== 'object') return
    this.environment = environment
    this.entity = page.entity

    const documents = await this.generateHtml(structure, page.locales)
    const bundle = await this.generateJsBundle(structure)

    for (const [index, document] of documents.entries()) {
      const script = document.createElement('script')
      script.type = 'module'
      script.textContent = bundle
      document.body.appendChild(script)

      const languageAlias = Array.from(page.locales.keys())[index]
      const pagePath = path.join(pagesDirectory, this.entity, languageAlias, 'index.html')
      await fs.mkdir(path.dirname(pagePath), { recursive: true })
      await fs.writeFile(pagePath, document.documentElement.outerHTML)
    }

    console.timeEnd('createPageHtml')
  }

  generateHtml = async (structure, locales) => {
    const documents = await Promise.all(Array.from(locales.keys()).map(async (languageAlias) => {
      this.importContents = ''
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
        title.textContent = locales.get(languageAlias).title

        const metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        metaDescription.setAttribute('content', locales.get(languageAlias).description)

        document.head.appendChild(viewport)
        document.head.appendChild(title)
        document.head.appendChild(metaDescription)

        this.body = document.createElement('body')

        await this.loadComponents(structure, document)
        return document
      } catch (err) {
        console.log(err)
      }
    }))

    return documents
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
        await this.loadComponents(value, document, element)
      } else {
        if (typeof value === 'object' && value !== null) value = JSON.stringify(value).replace(/"/g, "'")
        element.setAttribute(key, value)
      }
    }
  }

  generateJsBundle = async (structure) => {
    await this.importComponentsScripts(structure)
    const bundle = await this.createBundle()

    return bundle
  }

  importComponentsScripts = async (structure) => {
    // todo
    for (const [component, attributes] of Object.entries(structure)) {
      const componentPath = path.join(componentsDirectory, this.environment, `${component}.js`)
      const relativePath = path.relative(componentsDirectory, componentPath).replace(/\\/g, '/')
      this.importContents += `import './${relativePath}'\n`
    }
  }

  createBundle = async () => {
    const indexPath = path.join(componentsDirectory, 'index.js')
    await fs.writeFile(indexPath, this.importContents)

    const bundle = await rollup({
      input: path.join(componentsDirectory, 'index.js'),
      plugins: [nodeResolve()]
    })
    const { output } = await bundle.generate({
      format: 'es',
      sourcemap: true
    })

    const minifiedCodes = await Promise.all(
      output.map(async (chunkOrAsset) => {
        if (chunkOrAsset.type === 'chunk') {
          const minified = await terser.minify(chunkOrAsset.code)
          return minified.code
        }
        return ''
      })
    )

    return minifiedCodes.join('')
  }
}
