module.exports = function (sequelize, DataTypes) {
  const DialCode = sequelize.define('DialCode', {
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
    dialCode: {
      type: DataTypes.STRING,
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
    tableName: 'dial_codes',
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
        name: 'dial_codes_countryId_fk',
        using: 'BTREE',
        fields: [
          { name: 'countryId' }
        ]
      }
    ]
  })

  DialCode.associate = function (models) {
    DialCode.belongsTo(models.Country, { as: 'country', foreignKey: 'countryId' })
    DialCode.hasMany(models.Company, { as: 'companies', foreignKey: 'dialCodeId' })
    DialCode.hasMany(models.Customer, { as: 'customers', foreignKey: 'dialCodeId' })
  }

  return DialCode
}
