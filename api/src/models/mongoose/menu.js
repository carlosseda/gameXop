module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      environment: String,
      private: Boolean,
      languageAlias: String,
      items: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem'
        }
      ],
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Menu = mongoose.model('Menu', schema, 'menus')
  return Menu
}
