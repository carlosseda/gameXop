'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fingerprints', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      fingerprint: {
        type: Sequelize.STRING,
        allowNull: false
      },
      browser: {
        type: Sequelize.STRING,
        allowNull: false
      },
      browserVersion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      os: {
        type: Sequelize.STRING,
        allowNull: false
      },
      osVersion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      screenHeight: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      screenWidth: {
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

    await queryInterface.addIndex('fingerprints', ['customerId'], {
      name: 'fingerprints_customerId_fk'
    })

    await queryInterface.addIndex('fingerprints', ['cityId'], {
      name: 'fingerprints_cityId_fk'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fingerprints')
  }
}
