module.exports = function (sequelize, DataTypes) {
  const Company = sequelize.define('Company', {
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
    fiscalName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre Fiscal".'
        },
        is: {
          args: /^[a-z0-9\sáéíóúüñÁÉÍÓÚÜÑ]+$/i,
          msg: 'Por favor, rellena el campo "Nombre Fiscal" con un nombre válido, sin caracteres especiales.'
        }
      }
    },
    comercialName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre Comercial".'
        },
        is: {
          args: /^[a-z0-9\sáéíóúüñÁÉÍÓÚÜÑ]+$/i,
          msg: 'Por favor, rellena el campo "Nombre Comercial" con un nombre válido, sin caracteres especiales.'
        }
      }
    },
    vat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "NIF".'
        },
        isAlphanumeric: {
          msg: 'Por favor, rellena el campo "NIF" con un NIF válido, sin caracteres especiales.'
        }
      }
    },
    comercialAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Dirección Comercial".'
        }
      }
    },
    fiscalAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Dirección Fiscal".'
        }
      }
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Código Postal".'
        },
        isNumeric: {
          msg: 'Por favor, rellena el campo "Código Postal" con un código postal válido.'
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

          Company.findOne({ where: { email: value } }).then(function (company) {
            if (company && self.id !== company.id) {
              return next('Ya existe una empresa con este email.')
            }
            return next()
          }).catch(function (err) {
            return next(err)
          })
        }
      }
    },
    web: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Sitio web".'
        }
      }
    },
    telephone: {
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
    tableName: 'companies',
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
        name: 'companies_countryId_fk',
        using: 'BTREE',
        fields: [
          { name: 'countryId' }
        ]
      },
      {
        name: 'companies_cityId_fk',
        using: 'BTREE',
        fields: [
          { name: 'cityId' }
        ]
      },
      {
        name: 'companies_dialCodeId_fk',
        using: 'BTREE',
        fields: [
          { name: 'dialCodeId' }
        ]
      }
    ]
  })

  Company.associate = function (models) {
    Company.belongsTo(models.Country, { as: 'country', foreignKey: 'countryId' })
    Company.belongsTo(models.City, { as: 'city', foreignKey: 'cityId' })
    Company.belongsTo(models.DialCode, { as: 'dialCode', foreignKey: 'dialCodeId' })
  }

  return Company
}
