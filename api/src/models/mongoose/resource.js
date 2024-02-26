module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      entity: String,
      endpoint: String,
      model: String,
      lastUpdated: Date,
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Resource = mongoose.model('Resource', schema, 'resources')
  return Resource
}