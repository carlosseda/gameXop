module.exports = function (sequelize, DataTypes) {
  const ReturnError = sequelize.define('ReturnError', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    returnId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    errorCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    errorMessage: {
      type: DataTypes.STRING
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
        name: 'return_errors_customerId_fk',
        using: 'BTREE',
        fields: [
          { name: 'customerId' }
        ]
      },
      {
        name: 'return_errors_returnId_fk',
        using: 'BTREE',
        fields: [
          { name: 'returnId' }
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

  ReturnError.associate = function (models) {
    ReturnError.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
    ReturnError.belongsTo(models.Return, { as: 'return', foreignKey: 'returnId' })
    ReturnError.belongsTo(models.PaymentMethod, { as: 'paymentMethod', foreignKey: 'paymentMethodId' })
  }

  return ReturnError
}
