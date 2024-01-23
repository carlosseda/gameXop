const db = require('../models')
const Menu = db.Menu
const MenuItem = db.MenuItem
const LocaleSeo = db.LocaleSeo
const naming = require('../utils/naming')

module.exports = class MenuService {
  async addToAdminMenu (name) {
    const url = `${naming.kebabCase(name)}`

    const menu = await Menu.findOne({
      where: {
        name: 'admin-header'
      }
    })

    const newLocaleSeo = await LocaleSeo.create({
      language: 'es',
      url,
      title: name,
      sitemap: false
    })

    const newMenuItem = await MenuItem.create({
      menuId: menu.id,
      localeSeoId: newLocaleSeo.id,
      name,
      private: false
    })

    return newMenuItem
  }
}
