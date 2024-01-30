module.exports = function (sequelize, DataTypes) {
  const Return = sequelize.define('Return', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    saleId: {
      type: DataTypes.INTEGER
    },
    customerId: {
      type: DataTypes.INTEGER
    },
    paymentMethodId: {
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
    returnDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    returnTime: {
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
    tableName: 'returns',
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
        name: 'return_saleId_fk',
        using: 'BTREE',
        fields: [
          { name: 'saleId' }
        ]
      },
      {
        name: 'return_customerId_fk',
        using: 'BTREE',
        fields: [
          { name: 'customerId' }
        ]
      },
      {
        name: 'return_paymentMethodId_fk',
        using: 'BTREE',
        fields: [
          { name: 'paymentMethodId' }
        ]
      }
    ]
  })

  Return.associate = function (models) {
    Return.belongsTo(models.Sale, { as: 'sale', foreignKey: 'saleId' })
    Return.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
    Return.belongsTo(models.PaymentMethod, { as: 'paymentMethod', foreignKey: 'paymentMethodId' })
    Return.hasOne(models.Invoice, { as: 'invoices', foreignKey: 'returnId' })
    Return.hasOne(models.Ticket, { as: 'tickets', foreignKey: 'returnId' })
    Return.hasMany(models.ReturnDetail, { as: 'returnDetails', foreignKey: 'returnId' })
    Return.hasMany(models.ReturnError, { as: 'returnErrors', foreignKey: 'returnId' })
    Return.belongsToMany(models.Product, { through: models.ReturnDetail, as: 'products', foreignKey: 'returnId' })
  }

  return Return
}
