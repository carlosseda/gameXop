'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('return_details', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      returnId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'returns',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      localeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locales',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      priceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'prices',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      taxId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'taxes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      priceDiscountId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'price_discounts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      basePrice: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false
      },
      taxPrice: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false
      },
      quantity: {
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

    await queryInterface.addIndex('return_details', ['returnId'], {
      name: 'return_details_returnId_fk'
    })

    await queryInterface.addIndex('return_details', ['productId'], {
      name: 'return_details_productId_fk'
    })

    await queryInterface.addIndex('return_details', ['localeId'], {
      name: 'return_details_localeId_fk'
    })

    await queryInterface.addIndex('return_details', ['priceId'], {
      name: 'return_details_priceId_fk'
    })

    await queryInterface.addIndex('return_details', ['taxId'], {
      name: 'return_details_taxId_fk'
    })

    await queryInterface.addIndex('return_details', ['priceDiscountId'], {
      name: 'return_details_priceDiscountId_fk'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('return_details')
  }
}
