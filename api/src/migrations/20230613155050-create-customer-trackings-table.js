'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('customer_trackings', {
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
      eventTime: {
        type: Sequelize.DOUBLE
      },
      eventName: {
        type: Sequelize.STRING
      },
      path: {
        type: Sequelize.STRING
      },
      event: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('customer_trackings', ['customerId'], {
      name: 'customer_trackings_customerId_fk'
    })

    await queryInterface.addIndex('customer_trackings', ['fingerprintId'], {
      name: 'customer_trackings_fingerprintId_fk'
    })

    await queryInterface.addIndex('customer_trackings', ['localeSeoId'], {
      name: 'customer_trackings_localeSeoId_fk'
    })

    await queryInterface.addIndex('customer_trackings', ['localeSeoSlugId'], {
      name: 'customer_trackings_localeSeoSlugId_fk'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_trackings')
  }
}
