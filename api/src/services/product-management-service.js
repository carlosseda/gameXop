const mongooseDb = require('../models/mongoose')
const ProductSpecification = mongooseDb.ProductSpecification

module.exports = class ProductManagementService {
  createSpecifications = async (productId, specifications) => {
    try {
      specifications.productId = productId
      const productSpecification = new ProductSpecification(specifications)
      await productSpecification.save()
    } catch (err) {
      console.log(err)
    }
  }

  getSpecifications = async (data, productId) => {
    try {
      let query = ProductSpecification.findOne({ productId })

      const schemaPaths = ProductSpecification.schema.paths

      for (const field in schemaPaths) {
        if (schemaPaths[field] instanceof mongooseDb.mongoose.Schema.Types.ObjectId) {
          query = query.populate(field)
        }
      }

      const productSpecification = await query.select('-productId -createdAt -updatedAt -_id -__v').lean().exec()

      if (!productSpecification) {
        return data
      }

      data.dataValues = { ...data.dataValues, ...productSpecification }

      console.log(data.dataValues)

      return data
    } catch (err) {
      console.log(err)
    }
  }
}
