module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      entity: String,
      structure: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      locales: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const AdminPage = mongoose.model('AdminPage', schema, 'admin-pages')
  return AdminPage
}
