const data = [
  {
    entity: 'gallery',
    name: 'thumbnail',
    mediaQuery: 'xs',
    widthPx: 50,
    heightPx: 50,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'gallery',
    name: 'thumbnail',
    mediaQuery: 'sm',
    widthPx: 50,
    heightPx: 50,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'gallery',
    name: 'thumbnail',
    mediaQuery: 'md',
    widthPx: 135,
    heightPx: 135,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'gallery',
    name: 'thumbnail',
    mediaQuery: 'lg',
    widthPx: 135,
    heightPx: 135,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'users',
    name: 'avatar',
    mediaQuery: 'xs',
    widthPx: 50,
    heightPx: 50,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'users',
    name: 'avatar',
    mediaQuery: 'sm',
    widthPx: 50,
    heightPx: 50,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'users',
    name: 'avatar',
    mediaQuery: 'md',
    widthPx: 135,
    heightPx: 135,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'users',
    name: 'avatar',
    mediaQuery: 'lg',
    widthPx: 135,
    heightPx: 135,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'social_networks',
    name: 'icon',
    mediaQuery: 'xs',
    widthPx: 50,
    heightPx: 50,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'social_networks',
    name: 'icon',
    mediaQuery: 'sm',
    widthPx: 50,
    heightPx: 50,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'social_networks',
    name: 'icon',
    mediaQuery: 'md',
    widthPx: 150,
    heightPx: 150,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'social_networks',
    name: 'icon',
    mediaQuery: 'lg',
    widthPx: 150,
    heightPx: 150,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'products',
    name: 'home-product-gallery',
    mediaQuery: 'xs',
    widthPx: 50,
    heightPx: 50,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'products',
    name: 'home-product-gallery',
    mediaQuery: 'sm',
    widthPx: 50,
    heightPx: 50,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'products',
    name: 'home-product-gallery',
    mediaQuery: 'md',
    widthPx: 150,
    heightPx: 150,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'products',
    name: 'home-product-gallery',
    mediaQuery: 'lg',
    widthPx: 400,
    heightPx: 450,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'products',
    name: 'product-featured',
    mediaQuery: 'xs',
    widthPx: 50,
    heightPx: 50,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'products',
    name: 'product-featured',
    mediaQuery: 'sm',
    widthPx: 50,
    heightPx: 50,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'products',
    name: 'product-featured',
    mediaQuery: 'md',
    widthPx: 150,
    heightPx: 150,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'products',
    name: 'product-featured',
    mediaQuery: 'lg',
    widthPx: 1200,
    heightPx: 350,
    thumbnail: false,
    thumbnailWidthPx: null,
    thumbnailHeightPx: null
  },
  {
    entity: 'products',
    name: 'product-gallery',
    mediaQuery: 'xs',
    widthPx: 50,
    heightPx: 50,
    thumbnail: true,
    thumbnailWidthPx: 50,
    thumbnailHeightPx: 50
  },
  {
    entity: 'products',
    name: 'product-gallery',
    mediaQuery: 'sm',
    widthPx: 50,
    heightPx: 50,
    thumbnail: true,
    thumbnailWidthPx: 50,
    thumbnailHeightPx: 50
  },
  {
    entity: 'products',
    name: 'product-gallery',
    mediaQuery: 'md',
    widthPx: 700,
    heightPx: 650,
    thumbnail: true,
    thumbnailWidthPx: 90,
    thumbnailHeightPx: 90
  },
  {
    entity: 'products',
    name: 'product-gallery',
    mediaQuery: 'lg',
    widthPx: 700,
    heightPx: 650,
    thumbnail: true,
    thumbnailWidthPx: 90,
    thumbnailHeightPx: 90
  }
]

module.exports = async function (mongoose) {
  async function insertSeeder () {
    const Model = require('../../models/mongoose/image-configuration.js')(mongoose)
    await Model.insertMany(data)
  }

  insertSeeder()
}
