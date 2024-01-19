'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('page_trackings', {
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
      fingerprintId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'fingerprints',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      localeSeoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locale_seos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      localeSeoSlugId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locale_seo_slugs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isRobot: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      startTime: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      endTime: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      latencyMS: {
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

    await queryInterface.addIndex('page_trackings', ['customerId'], {
      name: 'page_trackings_customerId_fk'
    })

    await queryInterface.addIndex('page_trackings', ['fingerprintId'], {
      name: 'page_trackings_fingerprintId_fk'
    })

    await queryInterface.addIndex('page_trackings', ['localeSeoId'], {
      name: 'page_trackings_localeSeoId_fk'
    })

    await queryInterface.addIndex('page_trackings', ['localeSeoSlugId'], {
      name: 'page_trackings_localeSeoSlugId_fk'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('page_trackings')
  }
}
