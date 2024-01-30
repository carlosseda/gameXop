const db = require('../models')
const Op = db.Sequelize.Op
const Price = db.Price
const PriceDiscount = db.PriceDiscount

module.exports = class PriceManagementService {
  createPrice = async (productId, price) => {
    console.log('price', price)
    await Price.update({
      current: false
    }, {
      where: {
        productId,
        basePrice: {
          [Op.not]: price.basePrice
        },
        current: true
      }
    })

    return await Price.create({
      productId,
      current: true,
      basePrice: price.basePrice,
      taxId: price.taxId
    })
  }

  createPriceDiscount = async (priceId, priceDiscount) => {
    await PriceDiscount.update({
      current: false
    }, {
      where: { priceId }
    })

    return await Price.create({
      ...priceDiscount,
      priceId,
      current: true
    })
  }
}
