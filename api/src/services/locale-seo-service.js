const mongooseDb = require('../models/mongoose')
const LocaleSeo = mongooseDb.LocaleSeo

module.exports = class LocaleSeoService {
  createUrl = async (page, environment) => {
    const entityId = page._id

    for (const [languageAlias, locale] of page.locales) {
      const url = {
        entity: page.entity,
        environment,
        languageAlias,
        entityId,
        url: locale.url,
        title: locale.title,
        description: locale['short-description'],
        changeFrequency: 'monthly',
        priority: 1,
        sitemap: environment !== 'admin'
      }

      const localeSeo = await LocaleSeo.findOneAndUpdate(
        { languageAlias, entityId },
        url,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )

      locale.localeSeo = localeSeo._id
      page.locales.set(languageAlias, locale)
      page.markModified('locales')
      await page.save()
    }
  }

  createSlug = async (entity, entityElement, locales) => {
    for (const [languageAlias, locale] of Object.entries(locales)) {
      const entityId = entityElement._id
      const localeSeo = await LocaleSeo.findOne({ entity, languageAlias })
      const baseUrl = locale.title.toLowerCase().split(' ').join('-')
      let url = baseUrl
      let counter = 1

      const existingSlugIndex = localeSeo.slugs.findIndex(slug => slug.entityId.toString() === entityId.toString())

      if (existingSlugIndex !== -1) {
        localeSeo.slugs[existingSlugIndex].url = url
        localeSeo.slugs[existingSlugIndex].title = locale.title
        localeSeo.slugs[existingSlugIndex].description = locale['short-description']
      } else {
        while (localeSeo.slugs.some(slug => slug.url === url)) {
          url = `${baseUrl}-${counter}`
          counter++
        }

        localeSeo.slugs.push({
          entityId,
          url,
          title: locale.title,
          description: locale['short-description']
        })
      }

      await localeSeo.save()

      if (!entityElement.links) {
        entityElement.links = new Map()
      }

      if (!entityElement.links.get(languageAlias)) {
        entityElement.links.set(languageAlias, {})
      }

      url = `${localeSeo.url}/${url}`
      entityElement.links.set(languageAlias, url)

      await entityElement.save()
    }
  }
}
