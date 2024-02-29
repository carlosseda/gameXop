require('dotenv').config()
const fetch = require('node-fetch')
const moment = require('moment')
const mongooseDb = require('../models/mongoose')
const Resource = mongooseDb.Resource
const process = require('process')
const { Window } = require('happy-dom')
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
  createStaticPageHtml = async (page, environment, structure, cookie) => {
    console.time('createPageHtml')

    if (Object.keys(structure).length === 0 || typeof structure !== 'object') return
    this.cookie = cookie
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

        await this.loadComponents(structure, document, languageAlias)
        return document
      } catch (err) {
        console.log(err)
      }
    }))

    return documents
  }

  loadComponents = async (structure, document, languageAlias, parent = null) => {
    for (const [component, attributes] of Object.entries(structure)) {
      const components = Array.isArray(attributes) ? attributes : [attributes]

      for (const attribute of components) {
        await this.createElement(document, languageAlias, component, attribute, parent)
      }
    }
  }

  createElement = async (document, languageAlias, component, attributes, parent) => {
    const element = document.createElement(component)
    const container = parent || document.body
    container.appendChild(element)

    for (let [key, value] of Object.entries(attributes)) {
      if (key === 'slot' && typeof value === 'object' && value !== null) {
        await this.loadComponents(value, document, languageAlias, element)
      } else {
        if (key === 'data') this.hydrationPage(languageAlias, element, attributes)
        if (typeof value === 'object' && value !== null) value = JSON.stringify(value).replace(/"/g, "'")
        element.setAttribute(key, value)
      }
    }
  }

  hydrationPage = async (languageAlias, component, attributes) => {
    const resource = await Resource.findOne({
      endpoint: attributes.endpoint,
      deletedAt: { $exists: false }
    })

    if (!resource) return

    const data = attributes.fetch
      ? await this.fetchData(languageAlias, attributes)
      : await this.getAllData(resource, attributes)

    component.setAttribute('data', data)
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
          'process.env.DEFAULT_LANGUAGE': JSON.stringify(process.env.DEFAULT_LANGUAGE)
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

  getPage = async (environment, entity, languageAlias) => {
    const resources = await Resource.find({
      deletedAt: { $exists: false }
    }).lean().exec()

    const pagePath = path.join(pagesDirectory, environment, entity, languageAlias, 'index.html')
    const page = await fs.readFile(pagePath, 'utf8')
    const stats = await fs.stat(pagePath)

    const window = new Window()
    const document = window.document
    document.write((page).toString())

    let cache = false

    await Promise.all(Array.from(document.body.querySelectorAll('[data]')).map(async element => {
      const resource = resources.find(item => item.endpoint === element.getAttribute('endpoint'))

      if (resource && new Date(resource.lastUpdated).getTime() > new Date(stats.mtime).getTime()) {
        cache = true

        const attributes = Array.from(element.attributes).reduce((obj, attr) => {
          obj[attr.name] = attr.value
          return obj
        }, {})

        const data = attributes.fetch
          ? await this.fetchData(languageAlias, attributes)
          : await this.getAllData(resource, attributes)

        element.setAttribute('data', data)
      }
    }))

    if (cache) {
      this.renewPageCache(environment, entity, languageAlias, document.documentElement.outerHTML)
    }

    return document.documentElement.outerHTML
  }

  getAllData = async (resource, attributes) => {
    const select = attributes.select ?? ''
    const limit = attributes.paginate ?? 0

    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }

    const model = mongooseDb[resource.model]
    const result = await model.find(whereStatement)
      .select(select)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    if (attributes.paginate) {
      const count = await model.countDocuments(whereStatement)
      const response = {
        rows: result.map(doc => ({
          ...doc,
          id: doc._id,
          _id: undefined,
          createdAt: doc.createdAt ? moment(doc.createdAt).format('YYYY-MM-DD HH:mm') : undefined,
          updatedAt: doc.updatedAt ? moment(doc.updatedAt).format('YYYY-MM-DD HH:mm') : undefined
        })),
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          currentPage: 1
        }
      }

      return JSON.stringify(response).replace(/"/g, "'")
    } else {
      const response = result.map(doc => ({
        ...doc,
        id: doc._id,
        _id: undefined,
        createdAt: doc.createdAt ? moment(doc.createdAt).format('YYYY-MM-DD HH:mm') : undefined,
        updatedAt: doc.updatedAt ? moment(doc.updatedAt).format('YYYY-MM-DD HH:mm') : undefined
      }))

      return JSON.stringify(response).replace(/"/g, "'")
    }
  }

  fetchData = async (languageAlias, attributes) => {
    const response = await fetch(`${process.env.API_URL}${attributes.endpoint}${attributes.fetch ?? ''}?language=${languageAlias}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: this.cookie
        }
      })

    const data = await response.json()

    return JSON.stringify(data).replace(/"/g, "'")
  }

  renewPageCache = async (environment, entity, languageAlias, page) => {
    const pagePath = path.join(pagesDirectory, environment, entity, languageAlias, 'index.html')
    fs.writeFile(pagePath, page)
  }
}
