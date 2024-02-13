module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
      },
      parentMenuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
      },
      order: Number,
      url: String,
      private: Boolean,
      locales: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const MenuItem = mongoose.model('MenuItem', schema, 'menu-items')
  return MenuItem
}
