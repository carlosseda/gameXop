module.exports = function (sequelize, DataTypes) {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dialCodeId: {
      type: DataTypes.INTEGER,
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
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Apellido".'
        }
      }
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Teléfono".'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Email".'
        },
        isEmail: {
          msg: 'Por favor, rellena el campo "Email" con un email válido.'
        },
        isUnique: function (value, next) {
          const self = this
          Customer.findOne({ where: { email: value } })
            .then(function (customer) {
              if (customer && self.id !== customer.id) {
                return next('Ya existe un cliente con ese email.')
              }
              return next()
            })
            .catch(function (err) {
              return next(err)
            })
        }
      }
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Código Postal".'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Dirección".'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Contraseña".'
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
    tableName: 'customers',
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
        name: 'customer_email_index',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'email' }
        ]
      },
      {
        name: 'customers_countryId_fk',
        using: 'BTREE',
        fields: [
          { name: 'countryId' }
        ]
      },
      {
        name: 'customers_cityId_fk',
        using: 'BTREE',
        fields: [
          { name: 'cityId' }
        ]
      },
      {
        name: 'customers_dialCodeId_fk',
        using: 'BTREE',
        fields: [
          { name: 'dialCodeId' }
        ]
      }
    ]
  })

  Customer.associate = function (models) {
    Customer.belongsTo(models.Country, { as: 'country', foreignKey: 'countryId' })
    Customer.belongsTo(models.City, { as: 'city', foreignKey: 'cityId' })
    Customer.belongsTo(models.DialCode, { as: 'dialCode', foreignKey: 'dialCodeId' })
    Customer.hasMany(models.ApiTracking, { as: 'apiTrackings', foreignKey: 'customerId' })
    Customer.hasMany(models.PageTracking, { as: 'pageTrackings', foreignKey: 'customerId' })
    Customer.hasMany(models.CustomerTracking, { as: 'customerTrackings', foreignKey: 'customerId' })
    Customer.hasMany(models.Fingerprint, { as: 'fingerprints', foreignKey: 'customerId' })
    Customer.hasMany(models.Cart, { as: 'carts', foreignKey: 'customerId' })
    Customer.hasMany(models.Sale, { as: 'sales', foreignKey: 'customerId' })
    Customer.hasMany(models.SaleError, { as: 'saleErrors', foreignKey: 'customerId' })
    Customer.hasMany(models.Return, { as: 'returns', foreignKey: 'customerId' })
    Customer.hasMany(models.ReturnError, { as: 'returnsErrors', foreignKey: 'customerId' })
    Customer.hasMany(models.Invoice, { as: 'invoices', foreignKey: 'customerId' })
    Customer.hasMany(models.Ticket, { as: 'tickets', foreignKey: 'customerId' })
    Customer.hasMany(models.SentEmail, { as: 'sentEmails', foreignKey: 'customerId' })
    Customer.hasMany(models.EmailError, { as: 'emailErrors', foreignKey: 'customerId' })
    Customer.belongsToMany(models.Email, { through: models.SentEmail, as: 'emails', foreignKey: 'customerId' })
  }

  return Customer
}
