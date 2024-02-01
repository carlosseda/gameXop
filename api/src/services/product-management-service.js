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

  updateSpecifications = async (productId, specifications) => {
    try {
      await ProductSpecification.findOneAndUpdate(
        { productId },
        specifications,
        { new: true }
      )
    } catch (err) {
      console.log(err)
    }
  }

  getSpecifications = async (productId, data) => {
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

      return data
    } catch (err) {
      console.log(err)
    }
  }
}
