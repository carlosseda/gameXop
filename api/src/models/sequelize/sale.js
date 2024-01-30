module.exports = function (sequelize, DataTypes) {
  const Sale = sequelize.define('Sale',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      cartId: {
        type: DataTypes.INTEGER
      },
      customerId: {
        type: DataTypes.INTEGER
      },
      paymentMethodId: {
        type: DataTypes.INTEGER
      },
      couponId: {
        type: DataTypes.INTEGER
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: false
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      totalBasePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      totalTaxPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      saleDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      saleTime: {
        type: DataTypes.TIME,
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
      tableName: 'sales',
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
          name: 'sales_cartId_fk',
          using: 'BTREE',
          fields: [
            { name: 'cartId' }
          ]
        },
        {
          name: 'sales_customerId_fk',
          using: 'BTREE',
          fields: [
            { name: 'customerId' }
          ]
        },
        {
          name: 'sales_paymentMethodId_fk',
          using: 'BTREE',
          fields: [
            { name: 'paymentMethodId' }
          ]
        },
        {
          name: 'sales_couponId_fk',
          using: 'BTREE',
          fields: [
            { name: 'couponId' }
          ]
        }
      ]
    }
  )

  Sale.associate = function (models) {
    Sale.belongsTo(models.Cart, { as: 'cart', foreignKey: 'cartId' })
    Sale.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
    Sale.belongsTo(models.PaymentMethod, { as: 'paymentMethod', foreignKey: 'paymentMethodId' })
    Sale.belongsTo(models.Coupon, { as: 'coupon', foreignKey: 'couponId' })
    Sale.hasOne(models.Return, { as: 'return', foreignKey: 'saleId' })
    Sale.hasOne(models.Invoice, { as: 'invoices', foreignKey: 'saleId' })
    Sale.hasOne(models.Ticket, { as: 'tickets', foreignKey: 'saleId' })
    Sale.hasMany(models.SaleDetail, { as: 'saleDetails', foreignKey: 'saleId' })
    Sale.belongsToMany(models.Product, { through: models.SaleDetail, as: 'products', foreignKey: 'saleId' })
  }

  return Sale
}
