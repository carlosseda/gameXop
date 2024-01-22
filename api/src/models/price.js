module.exports = function (sequelize, DataTypes) {
  const Price = sequelize.define('Price', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER
    },
    taxId: {
      type: DataTypes.INTEGER
    },
    basePrice: {
      type: DataTypes.DECIMAL
    },
    current: {
      type: DataTypes.BOOLEAN
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
    tableName: 'prices',
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
        name: 'prices_productId_fk',
        using: 'BTREE',
        fields: [
          { name: 'productId' }
        ]
      },
      {
        name: 'prices_taxId_fk',
        using: 'BTREE',
        fields: [
          { name: 'taxId' }
        ]
      }
    ]
  })

  Price.associate = function (models) {
    Price.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' })
    Price.belongsTo(models.Tax, { as: 'tax', foreignKey: 'taxId' })
    Price.hasMany(models.PriceDiscount, { as: 'priceDiscounts', foreignKey: 'priceId' })
    Price.hasMany(models.CartDetail, { as: 'cartDetails', foreignKey: 'priceId' })
    Price.hasMany(models.SaleDetail, { as: 'saleDetails', foreignKey: 'priceId' })
    Price.hasMany(models.ReturnDetail, { as: 'returnDetails', foreignKey: 'priceId' })
  }

  return Price
}
