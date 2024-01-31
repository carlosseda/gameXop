module.exports = class LocaleService {
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
