module.exports = function (sequelize, DataTypes) {
  const Country = sequelize.define('Country', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    iso2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    iso3: {
      type: DataTypes.STRING,
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
    tableName: 'countries',
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

  Country.associate = function (models) {
    Country.hasMany(models.City, { as: 'cities', foreignKey: 'countryId' })
    Country.hasMany(models.DialCode, { as: 'dialCodes', foreignKey: 'countryId' })
    Country.hasMany(models.Tax, { as: 'taxes', foreignKey: 'countryId' })
    Country.hasMany(models.Company, { as: 'companies', foreignKey: 'countryId' })
    Country.hasMany(models.Customer, { as: 'customers', foreignKey: 'countryId' })
  }

  return Country
}
