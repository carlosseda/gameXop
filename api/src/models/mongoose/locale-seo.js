module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      entity: String,
      languageAlias: String,
      url: String,
      title: String,
      description: String,
      redirect: mongoose.Schema.Types.ObjectId,
      changeFrequency: String,
      priority: Number,
      sitemap: Boolean,
      slugs: [
        {
          entityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductSpecification'
          },
          url: String,
          title: String,
          description: String,
          deletedAt: Date
        }
      ],
      deletedAt: Date
    },
    { timestamps: true }
  )

  const LocaleSeo = mongoose.model('LocaleSeo', schema, 'locale-seos')
  return LocaleSeo
}
