module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      url: String,
      images: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const SocialNetwork = mongoose.model('SocialNetwork', schema, 'social-networks')
  return SocialNetwork
}
