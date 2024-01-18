'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('api_trackings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      fingerprintId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'fingerprints',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      ip: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isRobot: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      resource: {
        allowNull: false,
        type: Sequelize.STRING
      },
      resourceElement: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      method: {
        allowNull: false,
        type: Sequelize.STRING
      },
      httpCode: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      message: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      startTime: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      endTime: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      latencyMS: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })

    await queryInterface.addIndex('api_trackings', ['customerId'], {
      name: 'api_trackings_customerId_fk'
    })

    await queryInterface.addIndex('api_trackings', ['fingerprintId'], {
      name: 'api_trackings_fingerprintId_fk'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('api_trackings')
  }
}
