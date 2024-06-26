module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      visible: Boolean,
      featured: Boolean,
      productId: String,
      developer: String,
      releaseDate: Date,
      categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory'
      }],
      platforms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductPlatform'
      }],
      locales: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      images: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      price: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      links: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const ProductSpecification = mongoose.model('ProductSpecification', schema, 'product-specifications')
  return ProductSpecification
}
