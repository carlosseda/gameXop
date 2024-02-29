module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    ,
    { timestamps: true }
  )

  const Menu = mongoose.model('Menu', schema, 'menus')
  return Menu
}
