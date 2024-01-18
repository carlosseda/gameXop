'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      countryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'countries',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      cityId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'cities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      dialCodeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'dial_codes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      fiscalName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      comercialName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      vat: {
        allowNull: false,
        type: Sequelize.STRING
      },
      comercialAddress: {
        allowNull: true,
        type: Sequelize.STRING
      },
      fiscalAddress: {
        allowNull: false,
        type: Sequelize.STRING
      },
      postalCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      web: {
        type: Sequelize.STRING
      },
      telephone: {
        type: Sequelize.STRING
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

    await queryInterface.addIndex('companies', ['countryId'], {
      name: 'companies_countryId_fk'
    })

    await queryInterface.addIndex('companies', ['cityId'], {
      name: 'companies_cityId_fk'
    })

    await queryInterface.addIndex('companies', ['dialCodeId'], {
      name: 'companies_dialCodeId_fk'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('companies')
  }
}
