module.exports = function (sequelize, DataTypes) {
  const PriceDiscount = sequelize.define('PriceDiscount', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    priceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    multiplier: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    current: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endsAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      get () {
        return this.getDataValue('createdAt')
          ? this.getDataValue('createdAt').toISOString().split('T')[0]
          : null
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get () {
        return this.getDataValue('updatedAt')
          ? this.getDataValue('updatedAt').toISOString().split('T')[0]
          : null
      }
    }
  }, {
    sequelize,
    tableName: 'price_discounts',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' }
        ]
      },
      {
        name: 'price_discounts_priceId_fk',
        using: 'BTREE',
        fields: [
          { name: 'priceId' }
        ]
      }
    ]
  })

  PriceDiscount.associate = function (models) {
    PriceDiscount.belongsTo(models.Price, { as: 'price', foreignKey: 'priceId' })
    PriceDiscount.hasMany(models.CartDetail, { as: 'cartDetails', foreignKey: 'priceDiscountId' })
    PriceDiscount.hasMany(models.SaleDetail, { as: 'saleDetails', foreignKey: 'priceDiscountId' })
    PriceDiscount.hasMany(models.ReturnDetail, { as: 'returnDetails', foreignKey: 'priceDiscountId' })
  }

  return PriceDiscount
}
