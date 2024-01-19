'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      cartId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'carts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
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
      paymentMethodId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'payment_methods',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      couponId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'coupons',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalBasePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalTaxPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      saleDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      saleTime: {
        type: Sequelize.TIME,
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

    await queryInterface.addIndex('sales', ['cartId'], {
      name: 'sales_cartId_fk'
    })

    await queryInterface.addIndex('sales', ['customerId'], {
      name: 'sales_customerId_fk'
    })

    await queryInterface.addIndex('sales', ['paymentMethodId'], {
      name: 'sales_paymentMethodId_fk'
    })

    await queryInterface.addIndex('sales', ['couponId'], {
      name: 'sales_couponId_fk'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales')
  }
}
