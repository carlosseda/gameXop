const db = require('../models')
const Price = db.Price
const PriceDiscount = db.PriceDiscount

module.exports = class PriceManagementService {
  createPrice = async (productId, price) => {
    await Price.update({
      current: false
    }, {
      where: { productId }
    })

    return await Price.create({
      ...price,
      productId,
      current: true
    })
  }

  updatePrice = async (productId, price) => {

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

  updatePriceDiscount = async (priceId, priceDiscount) => {

  }
}
