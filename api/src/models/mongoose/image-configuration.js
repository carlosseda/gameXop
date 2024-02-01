module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      entity: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      mediaQuery: {
        type: String,
        required: true
      },
      widthPx: {
        type: Number
      },
      heightPx: {
        type: Number
      },
      thumbnail: {
        type: Boolean,
        default: false
      },
      thumbnailWidthPx: {
        type: Number
      },
      thumbnailHeightPx: {
        type: Number
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const ImageConfiguration = mongoose.model('ImageConfiguration', schema, 'image-configurations')
  return ImageConfiguration
}
