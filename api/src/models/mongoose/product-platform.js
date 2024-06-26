module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      images: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const ProductPlatform = mongoose.model('ProductPlatform', schema, 'product-platforms')
  return ProductPlatform
}
