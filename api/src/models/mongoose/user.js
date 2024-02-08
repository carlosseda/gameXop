module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      password: String,
      images: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const User = mongoose.model('User', schema, 'users')
  return User
}
