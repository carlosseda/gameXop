module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      label: String,
      element: String,
      category: String,
      screenSizes: [String],
      optionsForm: Object,
      slot: Boolean,
      data: Boolean,
      paginate: Boolean,
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Component = mongoose.model('Component', schema, 'components')
  return Component
}
