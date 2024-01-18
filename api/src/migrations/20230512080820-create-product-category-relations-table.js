'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_category_relations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productCategoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'product_categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })

    await queryInterface.addIndex('product_category_relations', ['productId'], {
      name: 'product_category_relations_productId_fk'
    })

    await queryInterface.addIndex('product_category_relations', ['productCategoryId'], {
      name: 'product_category_relations_productCategoryId_fk'
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_category_relations')
  }
}
