module.exports = function (sequelize, DataTypes) {
  const ProductCategoryRelation = sequelize.define('ProductCategoryRelation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productCategoryId: {
      type: DataTypes.INTEGER,
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
    tableName: 'product_category_relations',
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
        name: 'product_category_relations_productId_fk',
        using: 'BTREE',
        fields: [
          { name: 'productId' }
        ]
      },
      {
        name: 'product_category_relations_productCategoryId_fk',
        using: 'BTREE',
        fields: [
          { name: 'productCategoryId' }
        ]
      }
    ]
  })

  ProductCategoryRelation.associate = function (models) {
    ProductCategoryRelation.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' })
    ProductCategoryRelation.belongsTo(models.ProductCategory, { as: 'productCategory', foreignKey: 'productCategoryId' })
  }

  return ProductCategoryRelation
}
