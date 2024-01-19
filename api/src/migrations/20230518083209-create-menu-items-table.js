'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('menu_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      menuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'menus',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      localeSeoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locale_seos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      localeSeoSlugId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locale_seo_slugs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      parent: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },
      customUrl: {
        type: Sequelize.STRING
      },
      private: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })

    await queryInterface.addIndex('menu_items', ['menuId'], {
      name: 'menu_items_menuId_fk'
    })

    await queryInterface.addIndex('menu_items', ['localeSeoId'], {
      name: 'menu_items_localeSeoId_fk'
    })

    await queryInterface.addIndex('menu_items', ['localeSeoSlugId'], {
      name: 'menu_items_localeSeoSlugId_fk'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('menu_items')
  }
}
