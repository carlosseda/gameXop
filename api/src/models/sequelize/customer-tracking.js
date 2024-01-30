module.exports = function (sequelize, DataTypes) {
  const CustomerTracking = sequelize.define('CustomerTracking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fingerprintId: {
      type: DataTypes.INTEGER
    },
    localeSeoId: {
      type: DataTypes.INTEGER
    },
    localeSeoSlugId: {
      type: DataTypes.INTEGER
    },
    eventTime: {
      type: DataTypes.DOUBLE
    },
    eventName: {
      type: DataTypes.STRING
    },
    path: {
      type: DataTypes.STRING
    },
    event: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'customer_trackings',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' }
        ]
      },
      {
        name: 'customer_trackings_customerId_fk',
        using: 'BTREE',
        fields: [
          { name: 'customerId' }
        ]
      },
      {
        name: 'customer_trackings_fingerprintId_fk',
        using: 'BTREE',
        fields: [
          { name: 'fingerprintId' }
        ]
      },
      {
        name: 'customer_trackings_localeSeoId_fk',
        using: 'BTREE',
        fields: [
          { name: 'localeSeoId' }
        ]
      },
      {
        name: 'customer_trackings_localeSeoSlugId_fk',
        using: 'BTREE',
        fields: [
          { name: 'localeSeoSlugId' }
        ]
      }
    ]
  })

  CustomerTracking.associate = function (models) {
    CustomerTracking.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
    CustomerTracking.belongsTo(models.Fingerprint, { as: 'fingerprint', foreignKey: 'fingerprintId' })
    CustomerTracking.belongsTo(models.LocaleSeo, { as: 'localeSeo', foreignKey: 'localeSeoId' })
    CustomerTracking.belongsTo(models.LocaleSeoSlug, { as: 'localeSeoSlug', foreignKey: 'localeSeoSlugId' })
  }

  return CustomerTracking
}
