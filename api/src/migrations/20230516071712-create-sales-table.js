'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        allowNull: false,
        type: Sequelize.STRING
      },
      totalPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2)
      },
      totalBasePrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2)
      },
      totalTaxPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2)
      },
      saleDate: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      saleTime: {
        allowNull: false,
        type: Sequelize.TIME
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
