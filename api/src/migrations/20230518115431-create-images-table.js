'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      imageConfigurationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'image_configurations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      entityId: {
        type: Sequelize.INTEGER
      },
      entity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING
      },
      originalFilename: {
        type: Sequelize.STRING
      },
      resizedFilename: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      alt: {
        type: Sequelize.STRING
      },
      languageAlias: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mediaQuery: {
        type: Sequelize.STRING,
        allowNull: false
      },
      latencyMs: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    await queryInterface.addIndex('images', ['imageConfigurationId'], {
      name: 'images_imageConfigurationId_fk'
    })

    await queryInterface.addIndex('images', ['entityId', 'entity', 'mediaQuery'], {
      name: 'images_entityId_entity_mediaQuery_index'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('images')
  }
}
