module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      developer: String
    },
    { timestamps: true }
  )

  const ProductSpecification = mongoose.model('ProductSpecification', schema)
  return ProductSpecification
}
