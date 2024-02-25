require('dotenv').config()
const mongooseDb = require('../models/mongoose')
const Resource = mongooseDb.Resource
const process = require('process')
const { Window, Browser } = require('happy-dom')
const { rollup } = require('rollup')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const terser = require('terser')
const htmlMinifier = require('html-minifier')
const fs = require('fs').promises
const path = require('path')
const stylesDirectory = `${path.dirname(require.main.filename)}/src/styles`
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
    const bundleJs = await this.generateJsBundle(structure)
    const minifiedCss = await this.generateCss()

    for (const [index, document] of documents.entries()) {
      const script = document.createElement('script')
      script.type = 'module'
      script.textContent = bundleJs
      document.body.appendChild(script)

      const style = document.createElement('style')
      style.textContent = minifiedCss
      document.head.appendChild(style)

      const languageAlias = Array.from(page.locales.keys())[index]
      const pagePath = path.join(pagesDirectory, this.environment, this.entity, languageAlias, 'index.html')
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
      const components = Array.isArray(attributes) ? attributes : [attributes]

      for (const attribute of components) {
        await this.createElement(document, component, attribute, parent)
      }
    }
  }

  createElement = async (document, component, attributes, parent) => {
    const element = document.createElement(component)
    const container = parent || document.body
    container.appendChild(element)

    for (let [key, value] of Object.entries(attributes)) {
      if (key === 'slot' && typeof value === 'object' && value !== null) {
        await this.loadComponents(value, document, element)
      } else {
        if (key === 'data') this.hydrationPage(element, value)
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
    for (const [component, attributes] of Object.entries(structure)) {
      if (attributes.slot && typeof attributes.slot === 'object' && attributes.slot !== null) await this.importComponentsScripts(attributes.slot)

      if (Array.isArray(attributes)) {
        const multipleComponents = attributes
        for (const component of multipleComponents) {
          if (component.slot) await this.importComponentsScripts(component.slot)
        }
      } else {
        const componentPath = path.join(componentsDirectory, this.environment, `${component}.js`)
        const relativePath = path.relative(componentsDirectory, componentPath).replace(/\\/g, '/')
        this.importContents += `import './${relativePath}'\n`
      }
    }
  }

  createBundle = async () => {
    const indexPath = path.join(componentsDirectory, 'index.js')
    await fs.writeFile(indexPath, this.importContents)

    const bundle = await rollup({
      input: path.join(componentsDirectory, 'index.js'),
      plugins: [
        nodeResolve(),
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
          'process.env.API_URL': JSON.stringify(process.env.API_URL),
          'process.env.DEFAULT_LANGUAGE ': JSON.stringify(process.env.DEFAULT_LANGUAGE)
        })
      ]
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

  generateCss = async () => {
    const css = await fs.readFile(`${stylesDirectory}/${this.environment}/app.css`, 'utf8')
    const minifiedCss = htmlMinifier.minify(css, { collapseWhitespace: true, minifyCSS: true })

    return minifiedCss
  }

  hydrationPage = async (component, endpoint, entity) => {
    const whereStatement = {}
    whereStatement.endpoint = endpoint
    whereStatement.deletedAt = { $exists: false }
    const resource = await Resource.findOne(whereStatement)

    if (!resource) return

    const model = mongooseDb[resource.model]
    const data = await model.find({}).lean().exec()
    component.setAttribute('data', JSON.stringify(data))
  }

  getPage = async (environment, entity, languageAlias) => {
    const pagePath = path.join(pagesDirectory, environment, entity, languageAlias, 'index.html')
    const page = await fs.readFile(pagePath, 'utf8')
    const stats = await fs.stat(pagePath)
    console.log(`Last modified: ${stats.mtime}`)

    const window = new Window()
    const document = window.document
    document.write((page).toString())

    document.body.querySelectorAll('[data]').forEach(element => {
      console.log(element.getAttribute('endpoint'))
    })

    return page
  }
}
