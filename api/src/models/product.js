module.exports = function (sequelize, DataTypes) {
  const Product = sequelize.define('Product', {
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
    featured: {
      type: DataTypes.BOOLEAN
    },
    visible: {
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
    tableName: 'products',
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

  Product.associate = function (models) {
    Product.hasMany(models.Price, { as: 'prices', foreignKey: 'productId' })
    Product.hasMany(models.CartDetail, { as: 'cartDetails', foreignKey: 'productId' })
    Product.hasMany(models.SaleDetail, { as: 'saleDetails', foreignKey: 'productId' })
    Product.hasMany(models.ReturnDetail, { as: 'returnDetails', foreignKey: 'productId' })
    Product.hasMany(models.ProductCategoryRelation, { as: 'productCategoryRelations', foreignKey: 'productId' })
    Product.belongsToMany(models.ProductCategory, { through: models.ProductCategoryRelation, as: 'categories', foreignKey: 'productId' })
  }

  return Product
}
