'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('customer_trackings', {
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
      localeSeoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locale_seos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      localeSlugSeoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locale_slug_seos',
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
        allowNull: false,
        type: Sequelize.TEXT
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

    await queryInterface.addIndex('customer_trackings', ['customerId'], {
      name: 'customer_trackings_customerId_fk'
    })

    await queryInterface.addIndex('customer_trackings', ['localeSeoId'], {
      name: 'customer_trackings_localeSeoId_fk'
    })

    await queryInterface.addIndex('customer_trackings', ['localeSlugSeoId'], {
      name: 'customer_trackings_localeSlugSeoId_fk'
    })

    await queryInterface.addIndex('customer_trackings', ['fingerprintId'], {
      name: 'customer_trackings_fingerprintId_fk'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_trackings')
  }
}
