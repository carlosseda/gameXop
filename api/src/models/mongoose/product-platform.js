module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String
    },
    { timestamps: true }
  )

  const ProductPlatform = mongoose.model('ProductPlatform', schema, 'product-platforms')
  return ProductPlatform
}
