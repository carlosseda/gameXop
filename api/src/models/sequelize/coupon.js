module.exports = function (sequelize, DataTypes) {
  const Coupon = sequelize.define('Coupon', {
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
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Nombre".'
        }
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Código".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Código".'
        }
      }
    },
    percentage: {
      type: DataTypes.DECIMAL,
      validate: {
        isNumeric: {
          msg: 'Por favor, rellena el campo "Porcentaje" con un número válido y entero.'
        }
      }
    },
    multiplier: {
      type: DataTypes.DECIMAL
    },
    startsAt: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Por favor, rellena el campo "Fecha de inicio" con una fecha válida.'
        }
      }
    },
    endsAt: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Por favor, rellena el campo "Fecha de inicio" con una fecha válida.'
        }
      }
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
    tableName: 'coupons',
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

  Coupon.associate = function (models) {
    Coupon.hasMany(models.Sale, { as: 'sales', foreignKey: 'CouponId' })
  }

  return Coupon
}
