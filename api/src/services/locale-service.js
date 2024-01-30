const sequelizeDb = require('../models/sequelize')
const Locale = sequelizeDb.Locale

module.exports = class LocaleService {
  create = async (entity, entityId, locale) => {
    for (const language in locale) {
      for (const key in locale[language]) {
        try {
          await Locale.create({
            languageAlias: language,
            entity,
            entityId,
            key,
            value: locale[language][key]
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  update = async (entity, entityId, locale) => {
    for (const language in locale) {
      for (const key in locale[language]) {
        try {
          await Locale.update({
            value: locale[language][key]
          }, {
            where: {
              languageAlias: language,
              entity,
              entityId,
              key
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  delete = async (entity, entityId) => {
    await Locale.destroy({
      where: {
        entity,
        entityId
      }
    })
  }

  parseLocales = async (collection) => {
    collection.forEach(item => {
      item.locales.forEach(locale => {
        item.dataValues[locale.key] = locale.value
      })

      delete item.dataValues.locales
    })

    return collection
  }
}
