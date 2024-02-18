module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      entity: String,
      endpoint: String,
      localeSeo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LocaleSeo'
      },
      structure: {
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
