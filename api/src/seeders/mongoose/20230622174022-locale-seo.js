const data = [
  {
    environment: 'front',
    entity: 'home',
    filename: 'home.html',
    languageAlias: 'es',
    url: '/',
    title: 'GameXop',
    description: 'GameXop',
    changeFrequency: 'daily',
    priority: 1,
    sitemap: true
  },
  {
    environment: 'front',
    entity: 'home',
    filename: 'home.html',
    languageAlias: 'en',
    url: '/',
    title: 'GameXop',
    description: 'GameXop',
    changeFrequency: 'daily',
    priority: 1,
    sitemap: true
  },
  {
    environment: 'front',
    entity: 'products',
    filename: 'product.html',
    languageAlias: 'es',
    url: '/juegos',
    title: 'Juegos',
    description: 'GameXop juegos',
    changeFrequency: 'monthly',
    priority: 0.9,
    sitemap: true
  },
  {
    environment: 'front',
    entity: 'products',
    filename: 'product.html',
    languageAlias: 'en',
    url: '/games',
    title: 'Games',
    description: 'GameXop games',
    changeFrequency: 'monthly',
    priority: 0.9,
    sitemap: true
  }
]

module.exports = async function (mongoose) {
  async function insertSeeder () {
    const Model = require('../../models/mongoose/locale-seo.js')(mongoose)
    await Model.insertMany(data)
  }

  insertSeeder()
}
