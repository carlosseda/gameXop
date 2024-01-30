const sequelizeDb = require('../models/sequelize')
const Price = sequelizeDb.Price
const PriceDiscount = sequelizeDb.PriceDiscount

module.exports = class PriceManagementService {
  createPrice = async (productId, price) => {
    try {
      const [existingPrice, created] = await Price.findOrCreate({
        attributes: ['id', 'basePrice', 'current'],
        where: { productId, current: true },
        defaults: { basePrice: price.basePrice, current: true }
      })

      if (existingPrice) {
        if (existingPrice.basePrice !== price.basePrice) {
          await existingPrice.update({ current: false })

          return await Price.create({
            productId,
            current: true,
            basePrice: price.basePrice
          })
        }
      } else {
        return created
      }
    } catch (err) {
      console.log(err)
    }
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
