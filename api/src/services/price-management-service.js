const sequelizeDb = require('../models/sequelize')
const Price = sequelizeDb.Price
const PriceDiscount = sequelizeDb.PriceDiscount

module.exports = class PriceManagementService {
  createPrice = async (productId, price) => {
    try {
      const [existingPrice, priceCreated] = await Price.findOrCreate({
        attributes: ['id', 'basePrice', 'current'],
        where: { productId, current: true },
        defaults: { basePrice: price.basePrice, current: true }
      })
      // TODO duplica al crear
      if (existingPrice) {
        if (existingPrice.basePrice !== price.basePrice) {
          await existingPrice.update({ current: false })

          return await Price.create({
            productId,
            current: true,
            basePrice: price.basePrice
          })
        }

        if (price.discountPercentage) {
          const multiplier = `0.${(100 - price.discountPercentage)}`

          const [existingDiscountPrice, discountCreated] = await PriceDiscount.findOrCreate({
            where: { priceId: existingPrice.id, current: true },
            defaults: { discountPercentage: price.discountPercentage, multiplier, startsAt: price.startsAt, endsAt: price.endsAt, current: true }
          })

          if (existingDiscountPrice) {
            if (existingDiscountPrice.discountPercentage !== price.discountPercentage || existingDiscountPrice.startsAt !== price.startsAt || existingDiscountPrice.endsAt !== price.endsAt) {
              await existingDiscountPrice.update({ current: false })

              return await PriceDiscount.create({
                priceId: existingPrice.id,
                discountPercentage: price.discountPercentage,
                multiplier,
                startsAt: price.startsAt,
                endsAt: price.endsAt,
                current: true
              })
            }
          }

          return discountCreated
        }
      } else {
        if (price.discountPercentage) {
          const multiplier = 1 - (price.discountPercentage / 100)

          const [existingDiscountPrice, discountCreated] = await PriceDiscount.findOrCreate({
            where: { priceId: priceCreated.id, current: true },
            defaults: { discountPercentage: price.discountPercentage, multiplier, startsAt: price.startsAt, endsAt: price.endsAt, current: true }
          })

          if (existingDiscountPrice) {
            if (existingDiscountPrice.discountPercentage !== price.discountPercentage || existingDiscountPrice.startsAt !== price.startsAt || existingDiscountPrice.endsAt !== price.endsAt) {
              await existingDiscountPrice.update({ current: false })

              return await PriceDiscount.create({
                priceId: priceCreated.id,
                discountPercentage: price.discountPercentage,
                multiplier,
                startsAt: price.startsAt,
                endsAt: price.endsAt,
                current: true
              })
            }
          }

          return discountCreated
        }

        return priceCreated
      }
    } catch (err) {
      console.log(err)
    }
  }

  getCurrentBasePrice = async (productId, data) => {
    const price = await Price.findOne({
      attributes: ['basePrice'],
      where: { productId, current: true }
    })

    if (!price) {
      return data
    }

    data.dataValues.price = price

    return data
  }
}
