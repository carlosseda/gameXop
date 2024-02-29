module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {{schema}},
    { timestamps: true }
  )

  const {{modelName}} = mongoose.model('{{modelName}}', schema, '{{entityName}}')
  return {{modelName}}
}
