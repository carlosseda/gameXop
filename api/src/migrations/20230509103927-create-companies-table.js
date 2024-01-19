'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      countryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'countries',
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
      dialCodeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dial_codes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      fiscalName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      comercialName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vat: {
        type: Sequelize.STRING,
        allowNull: false
      },
      comercialAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fiscalAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      web: {
        type: Sequelize.STRING
      },
      telephone: {
        type: Sequelize.STRING
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
