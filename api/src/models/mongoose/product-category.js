module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      visible: Boolean,
      locales: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const ProductCategory = mongoose.model('ProductCategory', schema, 'product-categories')
  return ProductCategory
}
