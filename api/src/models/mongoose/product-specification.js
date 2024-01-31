module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      productId: String,
      developer: String,
      genre: String,
      releaseDate: String,
      categories: [String],
      platforms: [String]
    },
    { timestamps: true }
  )

  const ProductSpecification = mongoose.model('ProductSpecification', schema)
  return ProductSpecification
}
