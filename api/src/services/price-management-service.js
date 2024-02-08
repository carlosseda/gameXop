const sequelizeDb = require('../models/sequelize')
const Price = sequelizeDb.Price
const PriceDiscount = sequelizeDb.PriceDiscount

module.exports = class PriceManagementService {
  createPrice = async (productId, data) => {
    try {
      const priceData = {
        productId,
        basePrice: data.basePrice,
        current: true
      }

      const priceDiscountData = {
        discountPercentage: data.discountPercentage ?? null,
        multiplier: data.discountPercentage ? parseFloat((1 - data.discountPercentage / 100).toFixed(2)) : null,
        startsAt: data.startsAt ?? null,
        endsAt: data.endsAt ?? null
      }

      let [price, created] = await Price.findOrCreate({
        attributes: ['id', 'basePrice', 'current'],
        where: { productId, current: true },
        defaults: priceData
      })

      if (!created && price.basePrice !== data.basePrice) {
        await price.update({ current: false })
        await PriceDiscount.update(
          { current: false },
          { where: { priceId: price.id, current: true } }
        )
        price = await Price.create(priceData)
      }

      priceDiscountData.priceId = price.id

      if (data.discountPercentage) {
        await PriceDiscount.update(
          { current: false },
          { where: { priceId: price.id, current: true } }
        )

        const priceDiscount = await PriceDiscount.create(priceDiscountData)

        priceData.priceDiscountId = priceDiscount.id
      } else {
        await PriceDiscount.update(
          { current: false },
          { where: { priceId: price.id, current: true } }
        )
      }

      delete priceData.current
      delete priceData.productId

      return [priceData, priceDiscountData]
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
