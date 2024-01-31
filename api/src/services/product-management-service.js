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
      const productSpecification = await ProductSpecification.findOne({ productId }, {
        productId: 0,
        createdAt: 0,
        updatedAt: 0,
        _id: 0,
        __v: 0
      })

      if (!productSpecification) {
        return data
      }

      data.dataValues.specifications = productSpecification.toObject()

      return data
    } catch (err) {
      console.log(err)
    }
  }
}
