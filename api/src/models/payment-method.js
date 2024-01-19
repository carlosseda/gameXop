module.exports = function (sequelize, DataTypes) {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre".'
        }
      }
    },
    configuration: {
      type: DataTypes.JSON,
      allowNull: false
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    tableName: 'payment_methods',
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
      }
    ]
  })

  PaymentMethod.associate = function (models) {
    PaymentMethod.hasMany(models.Return, { as: 'returns', foreignKey: 'paymentMethodId' })
    PaymentMethod.hasMany(models.ReturnError, { as: 'returnErrors', foreignKey: 'paymentMethodId' })
    PaymentMethod.hasMany(models.SaleError, { as: 'saleErrors', foreignKey: 'paymentMethodId' })
    PaymentMethod.hasMany(models.Sale, { as: 'sales', foreignKey: 'paymentMethodId' })
    PaymentMethod.belongsToMany(models.Product, { through: models.SaleDetail, as: 'products', foreignKey: 'paymentMethodId' })
  }

  return PaymentMethod
}
